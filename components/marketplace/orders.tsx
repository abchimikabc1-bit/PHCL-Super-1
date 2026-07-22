'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MARKETPLACE_PRODUCTS, MarketplaceProduct, getMarketplaceProductImage } from '../marketplace-products';
import { formatCurrency, convertCurrency, CurrencyCode } from './currency';

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  orderNumber: string;
  product: MarketplaceProduct;
  quantity: number;
  totalPriceUSD: number;
  paidCurrency: CurrencyCode;
  paymentProvider: string;
  orderDate: string;
  estimatedDelivery: string;
  status: OrderStatus;
  shippingAddress: string;
}

export default function Order() {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('TZS');

  // Demo Orders Data
  const [orders] = useState<OrderItem[]>([
    {
      id: 'ORD-10928',
      orderNumber: '#PHCL-88210',
      product: MARKETPLACE_PRODUCTS[0], // Mercedes C200
      quantity: 1,
      totalPriceUSD: MARKETPLACE_PRODUCTS[0].priceUSD + 150,
      paidCurrency: 'TZS',
      paymentProvider: 'BENK',
      orderDate: '20 Julai, 2026',
      estimatedDelivery: '25 Julai, 2026',
      status: 'SHIPPED',
      shippingAddress: 'Mikocheni B, Dar es Salaam, Tanzania',
    },
    {
      id: 'ORD-10929',
      orderNumber: '#PHCL-88211',
      product: MARKETPLACE_PRODUCTS[6], // iPhone 16 Pro Max
      quantity: 2,
      totalPriceUSD: MARKETPLACE_PRODUCTS[6].priceUSD * 2 + 50,
      paidCurrency: 'USD',
      paymentProvider: 'VISA',
      orderDate: '22 Julai, 2026',
      estimatedDelivery: '24 Julai, 2026',
      status: 'PROCESSING',
      shippingAddress: 'Oysterbay, Haile Selassie Rd, Dar es Salaam',
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState<OrderItem>(orders[0]);

  // Status steps mapping
  const statusSteps: { key: OrderStatus; label: string; icon: string }[] = [
    { key: 'PENDING', label: 'Imepokelewa', icon: '📝' },
    { key: 'PROCESSING', label: 'Inachakatwa', icon: '⚙️' },
    { key: 'SHIPPED', label: 'Imesafirishwa', icon: '🚚' },
    { key: 'DELIVERED', label: 'Imewasilishwa', icon: '✅' },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'PROCESSING': return 1;
      case 'SHIPPED': return 2;
      case 'DELIVERED': return 3;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-amber-500 font-bold text-xs tracking-wider uppercase">
              Order Fulfillment Engine
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center gap-3">
              📦 Ufuatiliaji wa Oda Zako
            </h1>
          </div>

          {/* Currency Selector */}
          <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-2xl flex items-center gap-1 self-start md:self-auto">
            {(['TZS', 'USD', 'nTZS', 'PI'] as CurrencyCode[]).map((code) => (
              <button
                key={code}
                onClick={() => setSelectedCurrency(code)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedCurrency === code
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Orders List (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider px-2">
              Orodha ya Oda ({orders.length})
            </h2>

            <div className="space-y-3">
              {orders.map((ord) => {
                const isSelected = ord.id === selectedOrder.id;
                const priceInSelectedCurrency = convertCurrency(ord.totalPriceUSD, 'USD', selectedCurrency);

                return (
                  <motion.div
                    key={ord.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setSelectedOrder(ord)}
                    className={`p-4 rounded-3xl border cursor-pointer transition ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 shadow-xl'
                        : 'bg-slate-900 border-slate-800/90 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-extrabold text-sm text-slate-100">{ord.orderNumber}</span>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-amber-400">
                        {ord.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 my-2">
                      <img
                        src={ord.product.image || getMarketplaceProductImage(ord.product)}
                        alt={ord.product.name}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-950 border border-slate-800"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs text-slate-200 truncate">{ord.product.name}</p>
                        <p className="text-[10px] text-slate-400">Tarehe: {ord.orderDate}</p>
                      </div>
                    </div>

                    <div className="border-t border-slate-800/80 pt-2.5 flex justify-between items-center text-xs">
                      <span className="text-slate-400">Jumla ya Malipo:</span>
                      <span className="font-extrabold text-amber-400">
                        {formatCurrency(priceInSelectedCurrency, selectedCurrency)}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Order Detail & Status Tracker (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs text-slate-400">Taarifa za Oda</span>
                <h2 className="text-2xl font-black text-white">{selectedOrder.orderNumber}</h2>
              </div>
              <span className="text-xs text-slate-400 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl self-start sm:self-auto font-mono">
                ID: {selectedOrder.id}
              </span>
            </div>

            {/* Live Progress Bar Status Tracker */}
            <div className="space-y-3 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
                Hatua ya Usafirishaji (Live Status)
              </h3>

              <div className="grid grid-cols-4 gap-2 text-center relative">
                {statusSteps.map((step, idx) => {
                  const currentIdx = getStepIndex(selectedOrder.status);
                  const isDone = idx <= currentIdx;

                  return (
                    <div key={step.key} className="flex flex-col items-center space-y-2 z-10">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center text-base font-bold transition border ${
                          isDone
                            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                            : 'bg-slate-900 text-slate-600 border-slate-800'
                        }`}
                      >
                        {step.icon}
                      </div>
                      <span className={`text-[10px] font-bold ${isDone ? 'text-slate-200' : 'text-slate-600'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items & Shipping Address Details */}
            <div className="space-y-4 text-xs text-slate-300">
              <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800 space-y-2">
                <p className="font-bold text-amber-400 text-sm">📍 Anwani ya Utoaji Mzigo</p>
                <p className="text-slate-300">{selectedOrder.shippingAddress}</p>
                <p className="text-slate-500">Muda wa Kufika (Est.): {selectedOrder.estimatedDelivery}</p>
              </div>

              <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800 space-y-2">
                <p className="font-bold text-amber-400 text-sm">💳 Taarifa za Malipo</p>
                <p className="text-slate-300">Njia Iliyotumika: <strong className="text-white">{selectedOrder.paymentProvider}</strong></p>
                <p className="text-slate-300">
                  Kiasi Kilicholipwa:{' '}
                  <strong className="text-amber-400 font-extrabold text-sm">
                    {formatCurrency(
                      convertCurrency(selectedOrder.totalPriceUSD, 'USD', selectedCurrency),
                      selectedCurrency
                    )}
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}