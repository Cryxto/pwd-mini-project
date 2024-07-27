'use client';
import Image from 'next/image';
import { ReactNode } from 'react';

const ExampleCard = (
  <>
    <h2 className="card-title">Card title!</h2>
    <p>If a dog chews shoes whose shoes does he choose?</p>
    <div className="card-actions justify-end">
      <button className="btn btn-primary">Buy Now</button>
    </div>
  </>
);

export function Card({
  children,
  theImage,
}: {
  children?: ReactNode;
  theImage?: string;
}) {
  return (
    <div className="card bg-base-100 sm:w-96 w-72 shadow-xl flex flex-col">
      {theImage && (
        <figure>
          <Image
            src={theImage}
            width={500}
            height={500}
            alt="Event Image"
            className="object-cover w-full"
          />
        </figure>
      )}
      <div className="card-body flex flex-col justify-between">{children ? children : ExampleCard}</div>
    </div>
  );
}
