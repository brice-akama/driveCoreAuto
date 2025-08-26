"use client";

import React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  SelectInput,
  DateTimeInput,
  required,
} from "react-admin";

const CouponCreate = (props: any) => (
  <Create
    {...props}
    transform={(data) => ({
      ...data,
      isAdmin: true, // automatically add this field
    })}
  >
    <SimpleForm>
      <TextInput source="code" label="Coupon Code" validate={required()} />
      <NumberInput source="discount" label="Discount Value" validate={required()} />
      <SelectInput
        source="type"
        label="Discount Type"
        choices={[
          { id: "percentage", name: "Percentage" },
          { id: "flat", name: "Flat" },
        ]}
        validate={required()}
      />
      <DateTimeInput source="expiresAt" label="Expiration Date" />
      <NumberInput source="usageLimit" label="Usage Limit" />
      <NumberInput
        source="minOrderValue"
        label="Minimum Order Value"
        helperText="The minimum cart subtotal required to apply this coupon"
      />
    </SimpleForm>
  </Create>
);

export default CouponCreate;

// The above code defines a React component for creating coupons in an admin interface using react-admin.