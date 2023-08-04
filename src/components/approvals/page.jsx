"use client";

import Image from "next/image";
import { Avatar,  ConfigProvider, Table } from "antd";
import { useState } from "react";
import dayjs from "dayjs";

const ApprovalsComponent = ({ employees, monthlyDateValue }) => {

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Tracked",
      dataIndex: "tracked",
      render: (_, record) => (
        <div>{record.position ? record.position : "-"}</div>
      ),
    },
    {
      title: "Regular",
      dataIndex: "regular",
      render: (_, record) => (
        <div>{record.location ? record.location : "-"}</div>
      ),
    },
    {
      title: "Overtime",
      dataIndex: "overtime",
      render: (_, record) => <div>{record.overtime ? record.overtime : "-"}</div>,
    },
    {
      title: "Timeoff",
      dataIndex: "timeoff",
      render: (_, record) => <div>{record.timeoff ? record.timeoff : "-"}</div>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, record) => <div>{record.status ? record.status : "Pending"}</div>,
    },
  ];
  


  return (
       <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#1890ff",
                },
              }}
            >
              <Table
                columns={columns}
                dataSource={employees}
                rowSelection={rowSelection}
              />
            </ConfigProvider>

  );
};

export default ApprovalsComponent;
