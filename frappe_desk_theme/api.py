import frappe
from frappe import _

from frappe_desk_theme.services.billing import generate_schedule
from frappe_desk_theme.services.invoice import create_due_invoice


@frappe.whitelist(allow_guest=True)
def get_custom_theme():
    theme = frappe.get_doc("Desk Theme")
    data = theme.as_dict()
    # Add carousel data if present
    carousel_data = theme.get_carousel_data() if hasattr(theme, 'get_carousel_data') else None
    if carousel_data:
        data["carousel"] = carousel_data
    return data

@frappe.whitelist(allow_guest=True)
def get_footer_html():
    """Get rendered footer HTML template with theme data"""
    try:
        theme = frappe.get_doc("Desk Theme")
        
        # Prepare context for template
        context = {
            'copyright_text': theme.copyright_text,
            'footer_powered_by': theme.footer_powered_by,
            'sticky_footer': theme.sticky_footer
        }
        
        # Render the template
        return frappe.render_template("frappe_desk_theme/templates/includes/desk_footer.html", context)
    except Exception as e:
        frappe.log_error(f"Error rendering footer template: {str(e)}")
        return ""


# ---------------------------------------------------------
# Generate Billing Schedule
# ---------------------------------------------------------

@frappe.whitelist()
def generate_billing_schedule(sales_order):

    doc = frappe.get_doc("Sales Order", sales_order)

    generate_schedule(doc)

    return "Billing Schedule Generated"
