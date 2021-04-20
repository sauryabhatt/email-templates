/** @format */

import React from "react";
import Link from "next/link";

function RecentlyViewed() {
  return (
    <div className="recently-viewed-container">
      <div className="qa-disp-ib">
        <div className="rv-title">Recently Viewed</div>
        <div className="rv-subtext">
          Continue from where you left. Review your previously viewed products
          or sellers in the past 30 days.
        </div>
      </div>
      <div className="qa-disp-ib">
        <Link href="/recently-viewed/product">
          <div className="rv-btn-block qa-cursor">
            <span className="rv-title" style={{ color: "#191919" }}>
              RECENTLY VIEWED
            </span>

            <div className="rv-fixed-btns">
              <div className="rv-link">
                PRODUCTS
                <svg
                  width="18"
                  height="8"
                  viewBox="0 0 18 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ marginLeft: "3px" }}
                >
                  <path
                    d="M17.4964 4.35355C17.6917 4.15829 17.6917 3.84171 17.4964 3.64645L14.3144 0.464467C14.1192 0.269205 13.8026 0.269205 13.6073 0.464467C13.4121 0.659729 13.4121 0.976312 13.6073 1.17157L16.4357 4L13.6073 6.82843C13.4121 7.02369 13.4121 7.34027 13.6073 7.53554C13.8026 7.7308 14.1192 7.7308 14.3144 7.53554L17.4964 4.35355ZM-4.37114e-08 4.5L17.1429 4.5L17.1429 3.5L4.37114e-08 3.5L-4.37114e-08 4.5Z"
                    fill="#874439"
                  />
                </svg>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/recently-viewed/seller">
          <div className="rv-btn-block qa-cursor">
            <span className="rv-title" style={{ color: "#191919" }}>
              RECENTLY VIEWED
            </span>

            <div className="rv-fixed-btns">
              <div className="rv-link">
                SELLERS
                <svg
                  width="18"
                  height="8"
                  viewBox="0 0 18 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ marginLeft: "3px" }}
                >
                  <path
                    d="M17.4964 4.35355C17.6917 4.15829 17.6917 3.84171 17.4964 3.64645L14.3144 0.464467C14.1192 0.269205 13.8026 0.269205 13.6073 0.464467C13.4121 0.659729 13.4121 0.976312 13.6073 1.17157L16.4357 4L13.6073 6.82843C13.4121 7.02369 13.4121 7.34027 13.6073 7.53554C13.8026 7.7308 14.1192 7.7308 14.3144 7.53554L17.4964 4.35355ZM-4.37114e-08 4.5L17.1429 4.5L17.1429 3.5L4.37114e-08 3.5L-4.37114e-08 4.5Z"
                    fill="#874439"
                  />
                </svg>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default RecentlyViewed;
