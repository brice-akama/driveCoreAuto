"use client";

import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  DateField,
} from "react-admin";

const CouponShow = (props: any) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="code" label="Coupon Code" />
      <NumberField source="discount" label="Discount Value" />
      <TextField source="type" label="Discount Type" />
      <DateField source="expiresAt" label="Expiration Date" />
      <NumberField source="usageLimit" label="Usage Limit" />
      <NumberField
        source="minOrderValue"
        label="Minimum Order Value"
        options={{ style: "currency", currency: "USD" }}
      />
      <NumberField source="usageCount" label="Times Used" />
      <DateField source="createdAt" label="Created At" />
    </SimpleShowLayout>
  </Show>
);

export default CouponShow;
