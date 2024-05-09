import time

import streamlit as st
from hydralit import HydraHeadApp
from util import BACKEND_URL, get_backend_session


class RegisterApp(HydraHeadApp):
    def __init__(self, title="", **kwargs):
        self.__dict__.update(kwargs)
        self.title = title

    def run(self):
        st.title(self.title)
        register_data = self._create_register_form()

        if register_data["submitted"]:
            self._do_register(register_data)

    def _create_register_form(self):
        login_form = st.form(key="login_form")
        form_state = {}
        form_state["username"] = login_form.text_input("Username")
        form_state["email"] = login_form.text_input("E-mail")
        form_state["password1"] = login_form.text_input("Password", type="password")
        form_state["password2"] = login_form.text_input("Repeat password", type="password")
        form_state["submitted"] = login_form.form_submit_button("Register")

        return form_state

    def _do_register(self, register_data):
        if register_data["password1"] != register_data["password2"]:
            st.error("Passwords do not match.")
            st.stop()

        response = get_backend_session().post(
            f"{BACKEND_URL}/register",
            json={
                "username": register_data["username"],
                "password": register_data["password1"],
                "email": register_data["email"],
            },
        )

        if response.status_code == 200:
            with st.spinner("Now redirecting to login...."):
                time.sleep(2)
                self.set_access(0, "login")
                self.do_redirect()

        else:
            st.error("Registration failed, please try again.")
            st.stop()
