// Defining Value-Types since we dont know types of value at runtime
export type ValueType = "null" | "number" | "boolean";

export interface RuntimeVal {
    type: ValueType;
}

export interface NullVal extends RuntimeVal {
    type: "null";
    value: null;
}

export function MK_NULL() {
    return { type: "null", value: null } as NullVal;
}

export interface NumberVal extends RuntimeVal {
    type: "number";
    value: number;
}

//The default Value is 0
export function MK_NUMBER(n = 0) {
    return { type: "number", value: n } as NumberVal;
}

export interface BooleanVal extends RuntimeVal {
    type: "boolean";
    value: boolean;
}

//The default Value is 0
export function MK_BOOL(b = true) {
    return { type: "boolean", value: b } as BooleanVal;
}