from uuid import UUID

from app.core.db import Session
from app.models import Group, User, UserGroup
from app.services.auth_service import pwd_context


def populate_db(db: Session) -> None:
    pw = pwd_context.hash("easy-pw-123")
    user1 = User(
        id=UUID("398a95d6-f521-4572-b65c-e8b024f04030"),
        email="joedoe@gmail.com",
        username="joedoe",
        password=pw,
    )
    user2 = User(
        id=UUID("d1a0fdd8-db0a-4368-bb5a-b01bdeed6563"),
        email="louishamilton@gmail.com",
        username="louishamilton",
        password=pw,
    )
    user3 = User(
        id=UUID("78a91f2c-d65d-4cdf-be40-57879678ed4d"),
        email="cristianoronaldo@gmail.com",
        username="cristianoronaldo",
        password=pw,
    )
    users = [user1, user2, user3]
    for user in users:
        db.add(user)
    db.commit()

    group1 = Group(
        id=UUID("a953d022-4895-4327-bd44-82a41b2a9725"),
        name="Joe's personal group",
        description="Joe's personal group",
    )
    group1links = [
        UserGroup(user_id=user1.id, group_id=group1.id),
    ]
    group2 = Group(
        id=UUID("c018fc08-0873-4355-bc95-40a07f146cf7"),
        name="General group",
        description="Group that includes all users",
    )
    group2links = [
        UserGroup(user_id=user1.id, group_id=group2.id),
        UserGroup(user_id=user2.id, group_id=group2.id),
        UserGroup(user_id=user3.id, group_id=group2.id),
    ]

    groups = [group1, group2]
    groups_links = [group1links, group2links]
    users_groups = [link for links in groups_links for link in links]
    for group in groups:
        db.add(group)
    db.commit()
    for link in users_groups:
        db.add(link)
    db.commit()
