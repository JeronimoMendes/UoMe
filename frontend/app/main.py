from hydralit import HydraApp
from subapps.home_app import HomeApp
from subapps.login_app import LoginApp
from subapps.register_app import RegisterApp

if __name__ == "__main__":
    app = HydraApp(
        title="Hydralit Example",
        use_navbar=True,
    )

    app.add_app("Login", LoginApp(title="Login"), is_login=True)
    app.add_app("Home", HomeApp(title="Home"), is_home=True)
    app.add_app("Register", RegisterApp(title="Register"), is_unsecure=True)
    app.run()
