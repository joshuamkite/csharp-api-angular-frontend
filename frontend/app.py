import streamlit as st
import requests

API_URL = "http://api:8080/api/Loans"

st.title("Loan Management System")
st.markdown("### Connect to C# .NET Core API")

# Create a tabbed interface
tab1, tab2, tab3, tab4, tab5 = st.tabs(["Add Loan", "Get by Borrower", "Get by ID", "Get All Loans", "Delete Loan"])

# Add Loan Tab
with tab1:
    st.header("Add a New Loan")

    with st.form("add_loan_form"):
        loan_id = st.text_input("Loan ID", key="add_loan_id")
        borrower_name = st.text_input("Borrower Name", key="add_borrower_name")

        # Bonus fields
        col1, col2 = st.columns(2)
        with col1:
            repayment_amount = st.number_input("Repayment Amount", min_value=0.0, step=0.01, key="add_repayment_amount")
        with col2:
            funding_amount = st.number_input("Funding Amount", min_value=0.0, step=0.01, key="add_funding_amount")

        submit_button = st.form_submit_button("Add Loan")

        if submit_button:
            if not loan_id or not borrower_name:
                st.error("Loan ID and Borrower Name are required!")
            else:
                loan_data = {
                    "loanID": loan_id,
                    "borrowerName": borrower_name,
                    "repaymentAmount": repayment_amount,
                    "fundingAmount": funding_amount
                }

                try:
                    response = requests.post(API_URL, json=loan_data)
                    if response.status_code == 201:
                        st.success(f"Loan {loan_id} added successfully!")
                    else:
                        st.error(f"Error: {response.status_code} - {response.text}")
                except Exception as e:
                    st.error(f"Exception: {str(e)}")

# Get by Borrower Tab
with tab2:
    st.header("Get Loans by Borrower Name")

    with st.form("get_by_borrower_form"):
        borrower_name = st.text_input("Borrower Name", key="get_borrower_name")
        submit_button = st.form_submit_button("Get Loans")

        if submit_button:
            if not borrower_name:
                st.warning("Please enter a borrower name.")
            else:
                try:
                    response = requests.get(f"{API_URL}/borrower/{borrower_name}")
                    if response.status_code == 200:
                        loans = response.json()
                        st.success(f"Found {len(loans)} loan(s) for {borrower_name}")
                        st.json(loans)
                    elif response.status_code == 404:
                        st.warning(f"No loans found for borrower: {borrower_name}")
                    else:
                        st.error(f"Error: {response.status_code} - {response.text}")
                except Exception as e:
                    st.error(f"Exception: {str(e)}")

# Get by ID Tab
with tab3:
    st.header("Get Loan by ID")

    with st.form("get_by_id_form"):
        loan_id = st.text_input("Loan ID", key="get_loan_id")
        submit_button = st.form_submit_button("Get Loan")

        if submit_button:
            if not loan_id:
                st.warning("Please enter a loan ID.")
            else:
                try:
                    response = requests.get(f"{API_URL}/{loan_id}")
                    if response.status_code == 200:
                        loan = response.json()
                        st.success(f"Found loan with ID: {loan_id}")
                        st.json(loan)
                    elif response.status_code == 404:
                        st.warning(f"No loan found with ID: {loan_id}")
                    else:
                        st.error(f"Error: {response.status_code} - {response.text}")
                except Exception as e:
                    st.error(f"Exception: {str(e)}")

# Get All Loans Tab
with tab4:
    st.header("Get All Loans")

    if st.button("Get All Loans"):
        try:
            response = requests.get(API_URL)
            if response.status_code == 200:
                loans = response.json()
                if loans:
                    st.success(f"Found {len(loans)} loan(s)")
                    st.json(loans)
                else:
                    st.info("No loans found in the system.")
            else:
                st.error(f"Error: {response.status_code} - {response.text}")
        except Exception as e:
            st.error(f"Exception: {str(e)}")

# Delete Loan Tab
with tab5:
    st.header("Delete Loan by ID")

    with st.form("delete_loan_form"):
        loan_id = st.text_input("Loan ID", key="delete_loan_id")
        submit_button = st.form_submit_button("Delete Loan")

        if submit_button:
            if not loan_id:
                st.warning("Please enter a loan ID.")
            else:
                try:
                    response = requests.delete(f"{API_URL}/{loan_id}")
                    if response.status_code == 204:
                        st.success(f"Loan {loan_id} deleted successfully!")
                    elif response.status_code == 404:
                        st.warning(f"No loan found with ID: {loan_id}")
                    else:
                        st.error(f"Error: {response.status_code} - {response.text}")
                except Exception as e:
                    st.error(f"Exception: {str(e)}")
