import frappe
from frappe import _
from frappe.utils import getdate

from frappe_desk_theme.services.billing import generate_schedule
# from frappe_desk_theme.services.project import create_project


# ==========================================================
# VALIDATE
# ==========================================================

def validate(doc, method=None):

    validate_project_type(doc)

    calculate_duration(doc)

    # Generate billing schedule while still Draft
    if (
        doc.is_new()
        and doc.custom_project_type == "Contract"
        
    ):
        generate_schedule(doc)


# ==========================================================
# PROJECT TYPE VALIDATION
# ==========================================================

def validate_project_type(doc):

    if not doc.custom_project_type:
        frappe.throw(_("Project Type is mandatory."))

    if doc.custom_project_type != "Contract":
        return

    if not doc.custom_start_date:
        frappe.throw(_("Start Date is mandatory."))

    if not doc.custom_end_date:
        frappe.throw(_("End Date is mandatory."))

    if getdate(doc.custom_start_date) > getdate(doc.custom_end_date):
        frappe.throw(_("End Date must be after Start Date."))


# ==========================================================
# CALCULATE DURATION
# ==========================================================

def calculate_duration(doc):

    doc.custom_duration_months = 0

    if doc.custom_project_type != "Contract":
        return

    if not doc.custom_start_date or not doc.custom_end_date:
        return

    start = getdate(doc.custom_start_date)
    end = getdate(doc.custom_end_date)

    months = (
        (end.year - start.year) * 12
        + (end.month - start.month)
        + 1
    )

    doc.custom_duration_months = max(months, 1)


# ==========================================================
# BEFORE SUBMIT
# ==========================================================

def before_submit(doc, method=None):

    if (
        doc.custom_project_type == "Contract"
        and doc.custom_duration_months <= 0
    ):
        frappe.throw(_("Duration cannot be zero."))


# ==========================================================
# ON SUBMIT
# ==========================================================

def on_submit(doc, method=None):

    if doc.custom_project_type != "Contract":
        return

    from frappe_desk_theme.services.invoice import create_invoices_from_schedule

    create_invoices_from_schedule(doc)


# ==========================================================
# HELPERS
# ==========================================================

def is_contract(doc):
    return doc.custom_project_type == "Contract"


def is_project(doc):
    return doc.custom_project_type == "One-time Project"