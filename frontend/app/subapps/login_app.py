import streamlit as st
from hydralit import HydraHeadApp
from util import BACKEND_URL, get_backend_session


class LoginApp(HydraHeadApp):
    def __init__(self, title="", **kwargs):
        self.__dict__.update(kwargs)
        self.title = title

    def run(self):
        st.title(self.title)
        login_data = self._create_login_form()

        if login_data["submitted"]:
            self._do_login(login_data)

    def _create_login_form(self):
        login_form = st.form(key="login_form")
        form_state = {}
        form_state["username"] = login_form.text_input("Username")
        form_state["password"] = login_form.text_input("Password", type="password")
        form_state["submitted"] = login_form.form_submit_button("Login")

        if st.button("Sign Up", key="signupbtn"):
            # set access level to a negative number to allow a kick to the unsecure_app set in the parent
            self.set_access(-1, "guest")

            # Do the kick to the signup app
            self.do_redirect()

        return form_state

    def _do_login(self, login_data):
        response = get_backend_session().post(
            f"{BACKEND_URL}/token",
            data={
                "username": login_data["username"],
                "password": login_data["password"],
            },
        )

        if response.status_code == 200:
            self.set_access(1, login_data["username"], cache_access=True)
            session = get_backend_session(response.json()["access_token"])
            me_response = session.get(f"{BACKEND_URL}/users/me")
            self.session_state.current_user = me_response.json()
            self.do_redirect()

        else:
            st.error("Login failed, please try again.")
            st.stop()
