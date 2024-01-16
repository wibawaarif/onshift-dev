"use client";

import { useState, useEffect } from "react";
import { Input, Modal, message, ConfigProvider, Popover, Pagination } from "antd";
import Image from "next/image";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import _ from "lodash";

const fetcher = ([url, token]) =>
  fetch(url, {headers: { authorization: "Bearer " + token }}).then((res) =>
    res.json()
  );

const Location = () => {


  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#191407",
        },
      }}
    >
        <p>This is Leave page</p>
    </ConfigProvider>
  );
};

export default Location;
