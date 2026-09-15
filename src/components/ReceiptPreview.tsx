import React from 'react';
import { numberToEnglish } from '../utils/numberToWords';

export interface ReceiptData {
  date: string;
  amount: number | '';
  voucherNo: string;
  receivedFrom: string;
  onAccountOf: string;
}

interface ReceiptPreviewProps {
  data: ReceiptData;
}

export function ReceiptPreview({ data }: ReceiptPreviewProps) {
  const amountWords = data.amount
    ? numberToEnglish(Number(data.amount))
    : '';

  return (
    <div 
      className="bg-white p-8 sm:p-12 text-black text-[15px] leading-snug box-border w-full h-full" 
      id="printable-receipt"
      style={{ fontFamily: '"Times New Roman", Times, serif' }}
    >
      {/* Top Header */}
      <div className="relative mb-2">
        <div className="absolute top-0 left-0 font-bold text-sm">
          A.C.G.- 17
        </div>
        <div className="text-center font-bold italic text-[16px] leading-tight">
          <div>Please Pay Rs. <span className="ml-2">{data.amount}</span></div>
          <div>Rupees <span className="ml-2">{amountWords ? `${amountWords} Only` : ''}</span></div>
        </div>
      </div>

      {/* Logo & Department */}
      <div className="relative flex justify-center text-center mt-2 mb-6 min-h-[70px]">
        <div className="absolute left-0 top-2 w-20 flex items-start">
          <img 
            src="https://upload.wikimedia.org/wikipedia/en/3/32/India_Post.svg" 
            alt="India Post Logo" 
            className="w-full h-auto grayscale object-contain"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
          />
        </div>
        <div className="w-full pt-4">
          <h1 className="text-[22px] font-bold tracking-wide">DEPARTMENT OF POSTS - INDIA</h1>
          <p className="font-bold text-[14px] mt-1">
            (See Note below Rules 6 (b) of Appendix II to Posts and Telegraphs Financial Handbook Volume I)
          </p>
          <p className="font-bold text-[14px]">2nd Edition 2nd Reprinting)</p>
          <h2 className="font-bold text-[18px] mt-1">/Receipt</h2>
        </div>
      </div>

      {/* Row 1: The Date & Voucher */}
      <div className="flex font-bold mb-4 text-[15px]">
        <div className="w-[45%] flex">
          <span className="w-24">The</span>
          <span className="italic">{data.date}</span>
        </div>
        <div className="w-[55%] flex pl-8">
          <span className="w-32">Voucher No</span>
          <span className="italic">{data.voucherNo}</span>
        </div>
      </div>

      {/* Row 2: Received from */}
      <div className="flex font-bold mb-4 text-[15px]">
        <span className="w-44">Received from</span>
        <span className="italic">{data.receivedFrom}</span>
      </div>

      {/* Row 3: The Sum of Rupees */}
      <div className="flex font-bold mb-4 text-[15px]">
        <span className="w-44">The Sum of Rupees</span>
        <span className="italic">{amountWords ? `Rupees ${amountWords} Only` : ''}</span>
      </div>

      {/* Row 4: On Account of */}
      <div className="font-bold mb-4 text-[15px]">
        <div>On Account of</div>
        <div className="italic text-center mt-2 px-16 break-words">
          {data.onAccountOf}
        </div>
      </div>

      {/* Row 5: /Rs. */}
      <div className="font-bold text-[16px] mb-6 mt-4">
        /Rs. <span className="italic ml-12">{data.amount}</span>
      </div>

      {/* Signatures Area */}
      <div className="flex justify-between items-end font-bold text-[15px] mt-8 mb-4">
        <div>Witnessed Payment</div>
        <div className="italic pr-24">Rev Stamp</div>
      </div>

      {/* The Thick Lines and Witness/Payee */}
      <div className="w-full flex justify-between font-bold text-[15px] py-1 mb-1">
        <div className="pl-12">Signature of Witness</div>
        <div className="pr-12">Signature of Payee</div>
      </div>

      {/* Notes */}
      <div className="text-[14px] leading-snug font-bold text-left">
        <p className="mb-1">
          Note :- If the receipt be not written or not signed in English/Hindi the whole of the portion not in English/Hindi must be translated by the Paying Officer. A person signing such receipt in Hindi should be required to indicate his full name in block letters within brackets below his signature.
        </p>
        <p className="mb-1">
          If the person paid cannot sign, the payment must be certified by the paying officer and atleast one witness.
        </p>
        <p className="mb-1">
          If the amount be paid more than Rs. 5000/- a Receipt Stamp of 1/- must be affixed and this stamp must be paid for by the person to whom the amount of receipt is paid.
        </p>
      </div>

      {/* Certified */}
      <div className="font-bold text-[15px] mb-8 mt-2">
        1. Certified that the amount included in the voucher has been disbursed to the proper person.
      </div>
      
      <div className="flex justify-end font-bold mb-8 pr-8 text-[15px]">
        Paying Officer
      </div>
      
      <div className="flex justify-end font-bold mb-8 pr-8 text-[15px]">
        Counter Signed
      </div>

      <div className="flex justify-end font-bold mb-6 pr-8 text-[15px]">
        Disbursing Officer
      </div>

      <div className="font-bold text-[15px] leading-snug mb-8 text-left">
        2. Received contents and certified that I have satisfied myself that all advances included in receipt form A.C.G. 17 drawn 1 month / 2 months / 3 months previous to this date with the exception of those detailed below (of which the total has been refunded from this receipt) has been disbursed to the proper persons and that their acceptances have been taken & filed in my office with receipt stamps duly cancelled for every payment in excess of Rs. 5000/-
      </div>

      <div className="flex justify-between font-bold items-end pr-8 text-[15px] pb-4">
        <div className="flex">
          <span className="w-20">Date:</span>
          <span className="italic">{data.date}</span>
        </div>
        <div>
          Disbursing Officer
        </div>
      </div>
    </div>
  );
}
