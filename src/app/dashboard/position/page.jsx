"use client";

import { useState, useEffect } from "react";
import {
  Input,
  Avatar,
  Modal,
  Select,
  Tabs,
  Checkbox,
  message,
  Popover,
} from "antd";
import { ConfigProvider } from "antd";
import Image from "next/image";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import _ from "lodash";

const fetcher = ([url, token]) =>
  fetch(url, { headers: { authorization: "Bearer " + token } }).then((res) =>
    res.json()
  );

const Position = () => {

  const [clonedPositions, setClonedPositions] = useState([]);
  const [searchPositionsInput, setSearchPositionsInput] = useState('');
  const [positionModal, setPositionModal] = useState(false);
  const [avatarColor, setAvatarColor] = useState("#FFFFFF");
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [wage, setWage] = useState("");
  const [wageAmount, setwageAmount] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [filterValue, setFilterValue] = useState("");

  const [search, setSearch] = useState("");

  const [actionType, setActionType] = useState("");
  const [popover, setPopover] = useState(false);

  const session = useSession();

  let { data, error, isLoading, mutate } = useSWR(
    [`/api/positions`, session.data.user.accessToken],
    fetcher
  );
  let { data: employees } = useSWR(
    positionModal
      ? [`/api/employees`, session.data.user.accessToken]
      : null,
    fetcher
  );

  const avatarHexColor = [
    "#FFFFFF",
    "#E5E5E3",
    "#A7A7A7",
    "#7D7D80",
    "#646466",
  ];
  const wageType = [{ value: "Hourly", label: "Hourly" }];

  const checklist = (
    <Image
      width={16}
      height={16}
      alt="checklist-icon"
      src={"/static/svg/checklist.svg"}
    />
  );

  useEffect(() => {
    setClonedPositions(_.cloneDeep(data));
  }, [data]);

  useEffect(() => {
    const filteredList = _.cloneDeep(data)?.filter((x) => {
      return x.name.toLocaleLowerCase().includes(searchPositionsInput.toLocaleLowerCase())
    });

    if (searchPositionsInput) {
      setClonedPositions(filteredList);
    } else {
      setClonedPositions(_.cloneDeep(data));
    }
  }, [searchPositionsInput]);

  const clearFields = () => {
    setName("");
    setAvatarColor("#FFFFFF");
    setWage("");
    setwageAmount("");
    setId("");
    setSelectedEmployees([]);
  };

  const addPosition = async () => {
    setPositionModal(false);
    await fetch(`/api/positions`, {
      method: "POST",
      body: JSON.stringify({
        name,
        color: avatarColor,
        wageType: wage,
        wageAmount,
        employees: selectedEmployees,
      }),
      headers: {
        authorization: "Bearer " + session.data.user.accessToken,
      },
    });
    mutate([
      ...data,
      {
        name,
        color: avatarColor,
        wageType: wage,
        wageAmount,
        employees: selectedEmployees,
      },
    ]);

    message.success("Position created");

    clearFields();
  };

  const editPosition = async () => {
    setPositionModal(false);
    await fetch(`/api/positions/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        name,
        color: avatarColor,
        wageType: wage,
        wageAmount,
        employees: selectedEmployees,
      }),
      headers: {
        authorization: "Bearer " + session.data.user.accessToken,
      },
    });
    mutate([...data]);

    message.success("Position updated");

    clearFields();
  };

  const deletePosition = async () => {
    setPositionModal(false);
    await fetch(`/api/positions/${id}`, {
      method: "DELETE",
      headers: {
        authorization: "Bearer " + session.data.user.accessToken,
      },
    });
    mutate([...data]);

    message.success("Position deleted");
  };

  const checkedEmployee = (e) => {
    let newSelectedEmployees = [...selectedEmployees];

    if (e.target.checked) {
      newSelectedEmployees.push(e.target.name);
      setSelectedEmployees(newSelectedEmployees);
    } else {
      newSelectedEmployees = newSelectedEmployees.filter(
        (x) => x !== e.target.name
      );
      setSelectedEmployees(newSelectedEmployees);
    }
  };

  const handleAction = (type, data) => {
    setActionType(type);

    if (type === "edit") {
      setName(data.name);
      setWage(data.wageType);
      setwageAmount(data.wageAmount);
      setAvatarColor(data.color);
      setId(data._id);

      const grabIdEmployee = data.employees?.map(x => x._id);
      setSelectedEmployees(grabIdEmployee);
    }

    if (type === "delete") {
      setId(data);
    }

    setPositionModal(true);
    setPopover(false);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#191407",
        },
      }}
    >
      <div className="flex-1 flex flex-col">
        <div className="h-[71px] flex justify-between items-center px-8 py-1 border-b-[1px] border-[#E5E5E3]">
          <div className="w-48 flex">
            <Input
              onChange={e => setSearchPositionsInput(e.target.value)}
              placeholder="Position name"
              className="rounded-sm"
              prefix={
                <Image width={20} height={20} src={"/static/svg/lup.svg"} />
              }
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="px-8 py-8">
            <p className="text-2xl font-medium">
              Positions ({data && clonedPositions?.length})
            </p>

            <div className="h-full w-full mt-6 grid grid-cols-4 gap-6">
              {clonedPositions &&
                clonedPositions?.map((x, index) => {
                  return (
                    <div
                      key={index}
                      className="h-[97px] border-[1px] border-[#E5E5E3]"
                    >
                      <div className="px-4 py-4 flex justify-between">
                        <div className="flex">
                          <Avatar className={`bg-[${x.color}]`} />

                          <div className="flex flex-col ml-4">
                            <p>{x.name}</p>
                            <p className="mt-2 text-xs font-light">
                              {x.employees.length} EMPLOYEES
                            </p>
                          </div>
                        </div>

                        <div>
                          <Popover
                            content={
                              <div className="flex flex-col items-start">
                                <button onClick={() => handleAction("edit", x)}>
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleAction("delete", x._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            }
                            placement="bottomRight"
                            title="Action"
                            trigger="click"
                            open={popover === index}
                            onOpenChange={(e) => {
                              if (e) {
                                setPopover(index);
                              } else {
                                setPopover(null);
                              }
                            }}
                          >
                            <Image
                              className="hover:bg-[#E5E5E3] rotate-90 rounded-xl py-[1px] cursor-pointer transition duration-300"
                              width={20}
                              height={20}
                              alt="action-icon"
                              src={"/static/svg/action.svg"}
                            />
                          </Popover>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL ADD NEW SHIFT / TIME OFF */}
      <Modal
        footer={[
          <button
            className="mr-3 hover:bg-[#E5E5E3] px-4 py-1 border-[1px] border-[#E5E5E3] rounded-sm"
            key="back"
            onClick={() => setPositionModal(false)}
          >
            CLOSE
          </button>,
          <button
            className="bg-black text-white rounded-sm px-4 py-1 hover:opacity-80"
            key="submit"
            onClick={
              actionType === "edit"
                ? editPosition
                : actionType === "add"
                ? addPosition
                : deletePosition
            }
          >
            {actionType === "edit"
              ? "EDIT"
              : actionType === "add"
              ? "CREATE"
              : "CONFIRM"}
          </button>,
        ]}
        title={
          actionType === "edit"
            ? "Edit Position"
            : actionType === "add"
            ? "Create Position"
            : "Delete Position"
        }
        open={positionModal}
        onCancel={() => setPositionModal(false)}
      >
        {actionType !== "delete" && (
                  <div className="mt-4">
                    <div className="mt-1">
                      <span className="text-xs font-semibold">
                        POSITION NAME
                      </span>
                      <Input
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        className="rounded-none border-t-0 border-l-0 border-r-0"
                        placeholder="e.g Phlebotomist"
                      />
                    </div>

                    <div className="mt-4">
                      <span className="text-xs font-semibold">COLOR</span>
                      <div className="border-b-[1px] border-[#E5E5E3] flex py-2 mt-1">
                        {avatarHexColor?.map((x, index) => (
                          <Avatar
                            key={index}
                            onClick={() => setAvatarColor(x)}
                            className={`flex mr-1 cursor-pointer justify-center items-center ${
                              avatarColor === "#FFFFFF"
                                ? "border-[1px] border-[#E5E5E3]"
                                : undefined
                            } bg-[${x}]`}
                            size={24}
                          >
                            {avatarColor === x && checklist}
                          </Avatar>
                        ))}
                      </div>
                    </div>

                    <div className="flex mt-4 justify-between">
                      <div className="w-[48%] flex flex-col">
                        <span className="text-xs font-semibold">WAGE TYPE</span>
                        <Select
                          value={wage}
                          onChange={(e) => setWage(e)}
                          placeholder="Select wage type"
                          className="mt-1"
                          options={wageType}
                        />
                      </div>
                      <div className="w-[48%] flex flex-col">
                        <span className="text-xs font-semibold">
                          WAGE AMOUNT
                        </span>
                        <Input
                          onChange={(e) => setwageAmount(e.target.value)}
                          value={wageAmount}
                          className="rounded-none border-t-0 border-l-0 border-r-0"
                          suffix="usd per hour"
                        />
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-tight">
                      *Default wage that is displayed in all employees profiles
                      on this position, until custom wage is specified
                    </p>
                  </div>
        )}

        {actionType === "delete" && (
          <div>
            <p>Are you sure want to delete this position?</p>
          </div>
        )}
      </Modal>

      <button
        onClick={() =>
          setPositionModal(true) & setActionType("add") & clearFields()
        }
        className="hover:opacity-80 transition duration-300 absolute bottom-10 right-10 w-[180px] h-[40px] bg-black text-white rounded-full text-[14px]"
      >
        + CREATE POSITION
      </button>
    </ConfigProvider>
  );
};

export default Position;
