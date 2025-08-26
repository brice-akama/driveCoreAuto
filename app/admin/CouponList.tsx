"use client";

import React from "react";
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  BooleanField,
  EditButton,
  DeleteButton,
  ShowButton,
} from "react-admin";

const CouponList = (props: any) => {
  return (
    <List {...props} title="Coupons">
      <Datagrid rowClick="show">
        <TextField source="code" label="Coupon Code" />
        <NumberField source="discount" label="Discount Value" />
        <TextField source="type" label="Type" />
        <DateField source="expiresAt" label="Expiration Date" />
        <NumberField source="usageLimit" label="Usage Limit" />
        <NumberField source="usageCount" label="Used Count" />
        <DateField source="createdAt" label="Created At" />
        <EditButton />
        <ShowButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
};

export default CouponList;
// The above code defines a React component for listing coupons in an admin interface using react-admin.