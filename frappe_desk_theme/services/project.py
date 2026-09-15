# import frappe
# from frappe import _
# from erpnext.selling.doctype.sales_order.sales_order import make_sales_invoice


# # ==========================================================
# # Create Project
# # ==========================================================

# def create_project(doc):
#     """
#     Called from Sales Order on_submit().
#     """

#     if doc.custom_project_type != "One-time Project":
#         return

#     # Already created?
#     existing = frappe.db.exists(
#         "Project",
#         {
#             "sales_order": doc.name
#         }
#     )

#     if existing:
#         return existing

#     project = frappe.new_doc("Project")

#     project.project_name = (
#         doc.custom_project_name
#         or doc.name
#     )

#     project.customer = doc.customer
#     project.company = doc.company

#     project.expected_start_date = doc.transaction_date

#     if doc.delivery_date:
#         project.expected_end_date = doc.delivery_date

#     project.status = "Open"

#     # Standard ERPNext field
#     project.sales_order = doc.name

#     project.insert(ignore_permissions=True)

#     create_default_tasks(project, doc)

#     frappe.msgprint(
#         _("Project {0} created").format(project.name)
#     )

#     return project.name


# # ==========================================================
# # Default Tasks
# # ==========================================================

# def create_default_tasks(project, sales_order):
#     """
#     Creates one task for every Sales Order item.
#     """

#     for item in sales_order.items:

#         task = frappe.new_doc("Task")

#         task.subject = item.item_name
#         task.project = project.name
#         task.status = "Open"
#         task.exp_start_date = project.expected_start_date

#         task.insert(ignore_permissions=True)


# # ==========================================================
# # Project Completed
# # ==========================================================

# def project_completed(doc, method):
#     """
#     Hook:
#     Project -> on_update
#     """

#     if doc.status != "Completed":
#         return

#     if not doc.sales_order:
#         return

#     already = frappe.db.exists(
#         "Sales Invoice Item",
#         {
#             "sales_order": doc.sales_order
#         }
#     )

#     if already:
#         return

#     invoice = make_sales_invoice(doc.sales_order)

#     invoice.insert(ignore_permissions=True)
#     invoice.submit()

#     frappe.msgprint(
#         _("Sales Invoice {0} created").format(invoice.name)
#     )