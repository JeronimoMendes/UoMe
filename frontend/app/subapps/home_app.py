import streamlit as st
from hydralit import HydraHeadApp


class HomeApp(HydraHeadApp):
    def __init__(self, title="", **kwargs):
        self.__dict__.update(kwargs)
        self.title = title

    def run(self):
        st.title(self.title)
        username = self.session_state.current_user["username"]
        st.header(f"Welcome **{username}** to your new expense tracker!")
