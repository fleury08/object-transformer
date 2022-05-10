/**
 * @author Jaroslav Staněk
 * @version 1.0
 * @since 1.0
 * @copyright Copyright (c) 2022 Jaroslav Staněk
 * @license MIT
 * @description
 *
 * Object transformer class
 * Converts one object structure to another using template of key mappings
 * Template represents output object, where value in key/value pair is meant as mapped key of `input` object
 * simple example:
 * input: { a: 1, b: 2, c: 3, d: 4 }
 * template: { x: a, y: b, z: d}
 *
 * transformed output: { x: 1, y: 2, z: 4 }
 *
 * @example
 * const template = {
 *     "_id": "production_id",
 *     "contract": {
 *         "_id": "contract_id",
 *         "bussiness_partner": "contract_buss_partner",
 *         "signature_date": {"from": "contract_signature_date_from", "to": "contract_signature_date_to"},
 *     },
 *     "files": "production_files",
 *     "note": "production_note",
 *     "status": "production_status",
 *     "subject": {
 *         "_id": "policy_holder_id",
 *         "fullname": "policy_holder_fullname",
 *     },
 *     "timestamp": {"from": "production_timespan_from", "to": "production_timespan_to"},
 * }
 * const empty_inputs = {}
 * const single_input = {"production_id": "ABCD"}
 * const filled_inputs = {
 *     "contract_signature_points_from": 1.0,
 *     "contract_signature_points_to": 10.0,
 *     "contract_buss_partner": "The Company",
 *     "contract_id": "12345",
 *     "production_files": ["file1", "file2"]
 * }
 * const ot = new ObjectTransformer(template)
 *
 * console.log("EMPTY")
 * console.log(ot.transform(empty_inputs))
 * console.log("=".repeat(80));
 *
 * console.log("FILLED")
 * console.log(ot.transform(filled_inputs))
 * console.log("=".repeat(80));
 *
 * console.log("SINGLE")
 * console.log(ot.transform(single_input))
 * console.log("=".repeat(80));
 */
class ObjectTransformer {

    constructor(template = {}, inputs = {}) {
        this.template = template
        this.inputs = inputs
        this.root = null
    }

    transform(object_inputs = null, object_template = null) {
        if (object_template === null) object_template = this.template
        if (object_inputs === null) object_inputs = this.inputs
        this.root = {}
        this.fill_object_template(this.root, object_inputs, object_template)
        return this.construct_object_from_path(this.root)
    }


    fill_object_template(output, filled_inputs = null, object_template = null, path = "") {
        if(object_template === null) object_template = this.template
        if(filled_inputs === null) filled_inputs = this.inputs
        Object.keys(object_template).forEach(k => {
            let _path = path === "" ? k : path + "." + k
            if (typeof (object_template[k]) === "object") {
                this.fill_object_template(output, filled_inputs, object_template[k], _path)
            } else {
                if (Object.keys(filled_inputs).includes(object_template[k]))
                    output[_path] = filled_inputs[object_template[k]]
            }
        })

    }

    construct_object_from_path(object_with_path) {
        let output = {}
        Object.keys(object_with_path).forEach(k => {
            let k_split = k.split(".")
            let h_output = output
            k_split.forEach(k_s => {
                if (!Object.keys(h_output).includes(k_s)) {
                    h_output[k_s] = {}
                }
                if (k_split.slice(-1)[0] === k_s) {
                    h_output[k_s] = object_with_path[k]
                } else {
                    h_output = h_output[k_s]
                }
            })
        })
        return output
    }
}

