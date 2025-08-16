'use client';

import React from 'react';

const { QRCodeCanvas } = require('qrcode.react'); // ⬅️ Important: use QRCodeCanvas instead of QRCode

type QRCodeProps = {
  value: string;
  size?: number;
};

const QRCodeWrapper = ({ value, size = 160 }: QRCodeProps) => {
  return <QRCodeCanvas value={value} size={size} />;
};

export default QRCodeWrapper;