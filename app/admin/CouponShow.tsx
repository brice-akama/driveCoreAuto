"use client";

import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  DateField,
  NumberInput,
} from "react-admin";

const CouponShow = (props: any) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="code" label="Coupon Code" />
      <NumberField source="discount" label="Discount Value" />
      <TextField source="type" label="Discount Type" />
      <DateField source="expiresAt" label="Expiration Date" />
      <NumberField source="usageLimit" label="Usage Limit" />
      <NumberInput
              source="minOrderValue"
              label="Minimum Order Value"
              helperText="The minimum cart subtotal required to apply this coupon"
            />
      <NumberField source="usageCount" label="Times Used" />
      <DateField source="createdAt" label="Created At" />
    </SimpleShowLayout>
  </Show>
);

export default CouponShow;
// The above code defines a React component for displaying coupon details in an admin interface using react-admin.