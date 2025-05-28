import React from "react";

type SubmitBtnPropsT = {
  isPending: boolean;
  btnTxt: string;
};

export const SubmitBtn = ({ isPending, btnTxt }: SubmitBtnPropsT) => {
  return (
    <>
      <button
        type="submit"
        className="bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition font-semibold"
      >
        {isPending ? "..." : btnTxt}
      </button>
    </>
  );
};
