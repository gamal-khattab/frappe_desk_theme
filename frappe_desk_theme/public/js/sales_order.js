// frappe.ui.form.on("Sales Order", {
//     refresh(frm) {
//         update_contract_ui(frm);
//         add_contract_buttons(frm);
//     },

//     custom_contract_type(frm) {
//         update_contract_ui(frm);
//         add_contract_buttons(frm);
//     },

//     validate(frm) {

//         const type = frm.doc.custom_contract_type;

//         if (type === "Renewable") {

//             if (!frm.doc.custom_subscription_plan) {
//                 frappe.throw(__("Subscription Plan is required."));
//             }

//             if (!frm.doc.custom_start_date) {
//                 frappe.throw(__("Start Date is required."));
//             }

//             if (!frm.doc.custom_end_date) {
//                 frappe.throw(__("End Date is required."));
//             }
//         }

//         if (type === "Non-renewable") {

//             if (!frm.doc.custom_billing_schedule ||
//                 frm.doc.custom_billing_schedule.length === 0) {

//                 frappe.throw(__("Please add at least one Billing Schedule row."));
//             }
//         }

//     }
// });


// function update_contract_ui(frm) {

//     const type = frm.doc.custom_contract_type;

//     // Hide all contract-specific fields
//     frm.toggle_display("custom_subscription_plan", false);
//     frm.toggle_display("custom_billing_frequency", false);
//     frm.toggle_display("custom_auto_renewal", false);
//     frm.toggle_display("custom_renewal_days", false);
//     frm.toggle_display("custom_billing_schedule", false);

//     // Remove mandatory
//     frm.toggle_reqd("custom_subscription_plan", false);
//     frm.toggle_reqd("custom_billing_frequency", false);

//     if (type === "Renewable") {

//         frm.toggle_display("custom_subscription_plan", true);
//         frm.toggle_display("custom_billing_frequency", true);
//         frm.toggle_display("custom_auto_renewal", true);
//         frm.toggle_display("custom_renewal_days", true);

//         frm.toggle_reqd("custom_subscription_plan", true);
//         frm.toggle_reqd("custom_billing_frequency", true);
//     }

//     else if (type === "Non-renewable") {

//         frm.toggle_display("custom_billing_frequency", true);
//         frm.toggle_display("custom_billing_schedule", true);

//         frm.toggle_reqd("custom_billing_frequency", true);
//     }

//     else if (type === "One-time Project") {

//         // Nothing extra to display for now.
//     }

//     frm.refresh_fields();
// }


// function add_contract_buttons(frm) {

//     if (frm.doc.docstatus !== 1) {
//         return;
//     }

//     frm.clear_custom_buttons();

//     const type = frm.doc.custom_contract_type;

//     if (type === "Renewable") {

//         frm.add_custom_button(__("Open Subscription"), () => {

//             frappe.call({
//                 method: "frappe.client.get_list",
//                 args: {
//                     doctype: "Subscription",
//                     filters: {
//                         custom_sales_order: frm.doc.name
//                     },
//                     fields: ["name"],
//                     limit_page_length: 1
//                 },
//                 callback(r) {

//                     if (r.message && r.message.length) {
//                         frappe.set_route(
//                             "Form",
//                             "Subscription",
//                             r.message[0].name
//                         );
//                     } else {
//                         frappe.msgprint(__("No Subscription found."));
//                     }

//                 }
//             });

//         }, __("Marketing"));
//     }

//     if (type === "Non-renewable") {
//         frm.add_custom_button(__("Generate Billing Schedule"), () => {

//     frappe.call({
//         method: "frappe_desk_theme.services.api.generate_billing_schedule",
//         args: {
//             sales_order: frm.doc.name
//         },
//         freeze: true,
//         freeze_message: __("Generating Billing Schedule..."),
//         callback() {
//             frm.reload_doc();
//         }
//     });

// }, __("Marketing"));

//         frm.add_custom_button(__("Generate Invoices"), () => {

//             frappe.call({
//                 method: "frappe_desk_theme.services.api.generate_due_invoices",
//                 args: {
//                     sales_order: frm.doc.name
//                 },
//                 callback() {
//                     frm.reload_doc();
//                 }
//             });

//         }, __("Marketing"));
//     }



// if (type === "One-time Project") {

//     frm.add_custom_button(__("Open Project"), () => {

//         frappe.call({
//             method: "frappe.client.get_list",
//             args: {
//                 doctype: "Project",
//                 filters: {
//                     sales_order: frm.doc.name
//                 },
//                 fields: ["name"],
//                 limit_page_length: 1
//             },
//             callback(r) {

//                 if (r.message.length) {

//                     frappe.set_route(
//                         "Form",
//                         "Project",
//                         r.message[0].name
//                     );

//                 } else {

//                     frappe.msgprint(__("No Project Found."));

//                 }

//             }
//         });

//     }, __("Marketing"));

// }
//     if (type === "One-time Project") {

//         frm.add_custom_button(__("Create Project"), () => {

//             frappe.call({
//                 method: "frappe_desk_theme.services.api.create_project",
//                 args: {
//                     sales_order: frm.doc.name
//                 },
//                 callback(r) {

//                     if (r.message) {
//                         frappe.set_route(
//                             "Form",
//                             "Project",
//                             r.message
//                         );
//                     }

//                 }
//             });

//         }, __("Marketing"));
//     }
// }
frappe.ui.form.on("Sales Order", {

    refresh(frm) {

        toggle_fields(frm);

        add_buttons(frm);

    },

    custom_project_type(frm) {

        toggle_fields(frm);

    },

    custom_start_date(frm) {

        calculate_duration(frm);

    },

    custom_end_date(frm) {

        calculate_duration(frm);

    },

    validate(frm) {

        validate_contract(frm);

    }

});


/* ---------------------------------------------------------- */
/* Toggle Fields */
/* ---------------------------------------------------------- */

function toggle_fields(frm) {

    const contract = frm.doc.custom_project_type === "Contract";

    frm.toggle_display("custom_start_date", contract);
    frm.toggle_display("custom_end_date", contract);
    frm.toggle_display("custom_duration_months", contract);
    frm.toggle_display("custom_billing_schedule", contract);

    frm.toggle_reqd("custom_start_date", contract);
    frm.toggle_reqd("custom_end_date", contract);

    frm.refresh_fields();
}


/* ---------------------------------------------------------- */
/* Duration */
/* ---------------------------------------------------------- */

function calculate_duration(frm) {

    if (!frm.doc.custom_start_date || !frm.doc.custom_end_date) {

        frm.set_value("custom_duration_months", 0);

        return;
    }

    let start = frappe.datetime.str_to_obj(frm.doc.custom_start_date);
    let end = frappe.datetime.str_to_obj(frm.doc.custom_end_date);

    let months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth()) + 1;

    if (months < 1)
        months = 1;

    frm.set_value("custom_duration_months", months);
}


/* ---------------------------------------------------------- */
/* Validation */
/* ---------------------------------------------------------- */

function validate_contract(frm) {

    if (frm.doc.custom_project_type !== "Contract")
        return;

    if (!frm.doc.custom_start_date)
        frappe.throw(__("Start Date is mandatory."));

    if (!frm.doc.custom_end_date)
        frappe.throw(__("End Date is mandatory."));

    if (frm.doc.custom_duration_months <= 0)
        frappe.throw(__("Duration must be greater than zero."));
}


/* ---------------------------------------------------------- */
/* Buttons */
/* ---------------------------------------------------------- */

function add_buttons(frm) {

    if (frm.doc.docstatus !== 1)
        return;

    frm.clear_custom_buttons();

    //---------------------------------------------------------
    // CONTRACT
    //---------------------------------------------------------

    if (frm.doc.custom_project_type === "Contract") {

        frm.add_custom_button(
            __("Generate Billing Schedule"),
            () => {

                frappe.call({

                    method:
                    "frappe_desk_theme.api.generate_billing_schedule",

                    args: {
                        sales_order: frm.doc.name
                    },

                    freeze: true,

                    callback() {

                        frm.reload_doc();

                    }

                });

            },
            __("Marketing")
        );


        frm.add_custom_button(
            __("Create Due Invoice"),
            () => {

                frappe.call({

                    method:
                    "frappe_desk_theme.api.create_due_invoice",

                    args: {
                        sales_order: frm.doc.name
                    },

                    freeze: true,

                    callback(r) {

                        if (r.message && r.message.length) {

                            frappe.msgprint(
                                __("Created {0} invoice(s).", [r.message.length])
                            );

                        } else {

                            frappe.msgprint(
                                __("No installments are due.")
                            );

                        }

                        frm.reload_doc();

                    }

                });

            },
            __("Marketing")
        );

    }


    if (frm.doc.custom_project_type === "One-time Project") {

        frm.add_custom_button(
            __("Open Project"),
            () => {

                frappe.db.get_list("Project", {

                    filters: {

                        sales_order: frm.doc.name

                    },

                    fields: ["name"],

                    limit: 1

                }).then((r) => {

                    if (!r.length) {

                        frappe.msgprint(__("Project not found."));

                        return;

                    }

                    frappe.set_route(
                        "Form",
                        "Project",
                        r[0].name
                    );

                });

            },
            __("Marketing")
        );

    }

}

// frm.add_custom_button(__("Create Due Invoice"), () => {

//     frappe.call({

//         method:
//             "frappe_desk_theme.services.api.create_due_invoice",

//         args: {

//             sales_order: frm.doc.name

//         },

//         freeze: true,

//         callback(r) {

//             if (r.message.length) {

//                 frappe.msgprint(
//                     __("Created {0} invoice(s).", [r.message.length])
//                 );

//             }

//             else {

//                 frappe.msgprint(
//                     __("No installment is due.")
//                 );

//             }

//             frm.reload_doc();

//         }

//     });

// }, __("Marketing"));

// function add_project_button(frm) {

//     if (frm.doc.docstatus !== 1) return;

//     if (frm.doc.custom_project_type !== "One-time Project")
//         return;

//     frm.add_custom_button(__("Open Project"), () => {

//         frappe.db.get_list("Project", {

//             filters: {

//                 sales_order: frm.doc.name

//             },

//             fields: ["name"],

//             limit: 1

//         }).then((r) => {

//             if (!r.length) {

//                 frappe.msgprint(__("No Project Found"));

//                 return;
//             }

//             frappe.set_route(
//                 "Form",
//                 "Project",
//                 r[0].name
//             );

//         });

//     }, __("Marketing"));

// }