import { Paper, Typography } from "@mui/material";
import React from "react";

type Props = {
  title: string;
  headerElements?: React.ReactNode | React.ReactNode[];
  children?: React.ReactNode | React.ReactNode[];
  className?: string;
};

const DashboardCard: React.FC<Props> = ({
  title,
  headerElements,
  children,
  className
}) => {
  return (
    <Paper className={`p-3 ${className}`}>
      <div className="flex justify-between mb-5">
        <Typography variant="body1" fontWeight="bold">
          {title}
        </Typography>
        {headerElements}
      </div>
      <div className="flex flex-col p-3 space-y-4">{children}</div>
    </Paper>
  );
};

export default DashboardCard;
