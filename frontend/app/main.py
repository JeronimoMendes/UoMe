import requests
import streamlit as st

st.title("The following is the result of the API call to my backend")

response = requests.get("http://et-backend:8000/")

st.write(response.json())