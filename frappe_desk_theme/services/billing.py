import frappe
from frappe.utils import add_months
from frappe import _


def generate_schedule(doc):

    if doc.custom_project_type != "Contract":
        return

    doc.set("custom_billing_schedule", [])

    months = int(doc.custom_duration_months)

    monthly = round(doc.grand_total / months, 2)

    due_date = doc.custom_start_date

    total = 0

    for i in range(months):

        amount = monthly

        if i == months - 1:
            amount = round(doc.grand_total - total, 2)

        total += amount

        doc.append(
            "custom_billing_schedule",
            {
                # "installment_no": i + 1,
                "due_date": due_date,
                "amount": amount,
                "status": "Pending",
            }
        )

        due_date = add_months(due_date, 1)