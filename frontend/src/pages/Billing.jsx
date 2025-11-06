import { useState } from 'react'

function Billing() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Billing & Payments</h1>
        <button className="btn btn-primary">
          Create New Invoice
        </button>
      </div>

      <div className="card">
        <p className="text-gray-500 text-center py-8">
          Billing and payment management interface
        </p>
      </div>
    </div>
  )
}

export default Billing
