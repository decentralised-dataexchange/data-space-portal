"use client";

import React from "react";
import styles from "./TableSkeleton.module.scss";

export interface TableSkeletonColumn {
  /** Width of the skeleton bar (e.g., '80%', '120px') */
  width?: string;
  /** Whether this column contains action buttons */
  isAction?: boolean;
  /** Number of action buttons to show */
  actionCount?: number;
}

export interface TableSkeletonProps {
  /** Number of skeleton rows to display */
  rows?: number;
  /** Column configuration for the skeleton */
  columns: TableSkeletonColumn[];
  /** Whether to show the header row */
  showHeader?: boolean;
}

/**
 * TableSkeleton - Apple/Facebook-style shimmer loading animation for tables
 * 
 * Features the classic FAANG shimmer effect: a smooth gradient wave that
 * sweeps across placeholder elements from left to right.
 */
const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns,
  showHeader = true,
}) => {
  return (
    <div className="dd-container" style={{ backgroundColor: 'transparent', borderRadius: 0, overflowY: 'hidden', overflowX: 'auto', width: '100%' }}>
      <table className={styles.skeletonTable}>
        {showHeader && (
          <thead>
            <tr className={styles.skeletonRow}>
              {columns.map((col, idx) => (
                <th key={idx} className={styles.skeletonHeaderCell}>
                  <div
                    className={styles.skeletonHeaderBar}
                    style={{ width: col.width || "70%" }}
                  />
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx} className={styles.skeletonRow}>
              {columns.map((col, colIdx) => (
                <td key={colIdx} className={styles.skeletonCell}>
                  {col.isAction ? (
                    <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
                      {Array.from({ length: col.actionCount || 3 }).map((_, actionIdx) => (
                        <span key={actionIdx} className={styles.skeletonAction} />
                      ))}
                    </div>
                  ) : (
                    <div
                      className={styles.skeletonBar}
                      style={{ width: col.width || "80%" }}
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;
