# import frappe

# from frappe import _
# from frappe.utils import today, getdate

# from erpnext.selling.doctype.sales_order.sales_order import make_sales_invoice

import frappe

from erpnext.selling.doctype.sales_order.sales_order import make_sales_invoice


def create_invoices_from_schedule(doc):

    for row in doc.custom_billing_schedule:

        if row.invoice:
            continue

        invoice = make_sales_invoice(doc.name)

        invoice.items = []

        item = doc.items[0]

        invoice.append(
            "items",
            {
                "item_code": item.item_code,
                "item_name": item.item_name,
                "description": item.description,
                "qty": 1,
                "uom": item.uom,
                "rate": row.amount,
            }
        )

        invoice.run_method("set_missing_values")
        invoice.calculate_taxes_and_totals()

        invoice.insert(ignore_permissions=True)
        # invoice.submit()

        frappe.db.set_value(
            "Billing Schedule",
            row.name,
            {
                "invoice": invoice.name,
                "status": "Invoiced",
            }
        )

    frappe.db.commit()
# # ==========================================================
# # Create Due Invoice(s)
# # ==========================================================

# @frappe.whitelist()
# def create_due_invoice(sales_order):

#     doc = frappe.get_doc("Sales Order", sales_order)

#     created = []

#     for row in doc.custom_billing_schedule:

#         # Already invoiced
#         if row.invoice:
#             continue

#         # Future installment
#         if getdate(row.due_date) > getdate(today()):
#             continue

#         invoice = create_invoice(doc, row)

#         created.append(invoice)

#     if created:

#         frappe.msgprint(
#             _("{} invoice(s) created.").format(len(created))
#         )

#     else:

#         frappe.msgprint(_("No invoices are due."))

#     return created


# # ==========================================================
# # Create One Invoice
# # ==========================================================

# def create_invoice(sales_order, schedule):

#     # Prevent duplicates
#     if schedule.invoice:
#         return schedule.invoice

#     # Standard ERPNext mapping
#     invoice = make_sales_invoice(sales_order.name)

#     invoice.posting_date = today()
#     invoice.due_date = schedule.due_date

#     # Remove mapped items
#     invoice.set("items", [])

#     for item in sales_order.items:

#         invoice.append(
#             "items",
#             {
#                 "item_code": item.item_code,
#                 "item_name": item.item_name,
#                 "description": (
#                     f"{item.item_name}"
#                     f"\nInstallment #{schedule.installment_no}"
#                 ),
#                 "qty": 1,
#                 "uom": item.uom,
#                 "rate": schedule.amount,
#             }
#         )

#     invoice.run_method("set_missing_values")
#     invoice.calculate_taxes_and_totals()

#     invoice.insert(ignore_permissions=True)
#     invoice.submit()

#     # Update Billing Schedule row
#     frappe.db.set_value(
#         "Billing Schedule",
#         schedule.name,
#         {
#             "invoice": invoice.name,
#             "status": "Invoiced",
#         },
#         update_modified=False,
#     )

#     frappe.db.commit()

#     return invoice.name


# # ==========================================================
# # Daily Scheduler
# # ==========================================================

# def create_due_invoices():

#     orders = frappe.get_all(
#         "Sales Order",
#         filters={
#             "docstatus": 1,
#             "custom_project_type": "Contract",
#         },
#         pluck="name",
#     )

#     for so in orders:

#         try:
#             create_due_invoice(so)

#         except Exception:

#             frappe.log_error(
#                 frappe.get_traceback(),
#                 f"Automatic Invoice Creation - {so}",
#             )