"use client";

import { useState } from "react";
import { Input, Modal, message, ConfigProvider, Popover } from "antd";
import Image from "next/image";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import PlaceComponent from "@/components/place-autocomplete/page";
import GoogleMaps from "@/components/google-maps/page";

const fetcher = ([url, token]) =>
  fetch(url, { headers: { authorization: "Bearer " + token } }).then((res) =>
    res.json()
  );

const Location = () => {
  const [locationModal, setLocationModal] = useState(false);
  const [id, setId] = useState("");
  const [popover, setPopover] = useState(false);
  const [actionType, setActionType] = useState("");
  const [form, setForm] = useState({
    name: "",
    address: "",
    latitude: null,
    longitude: null,
    isSetted: false,
  });
  const [address, setAddress] = useState(null);
  const [latitude, setLatitude] = useState(24.432928);
  const [longitude, setLongitude] = useState(54.644539);

  const session = useSession();

  let {
    data: locations,
    error,
    isLoading,
    mutate,
  } = useSWR([`/api/locations`, session.data.user.accessToken], fetcher);

  const clearFields = () => {
    setForm({
      name: "",
      address: "",
      latitude: null,
      longitude: null,
      isSetted: false,
    });
    setLatitude(24.432928)
    setLongitude(54.644539)
    setAddress(null)
    setId("");
  };

  const addLocation = async () => {
    setLocationModal(false);
    const data = await fetch(`/api/locations`, {
      method: "POST",
      body: JSON.stringify({...form, address, longitude, latitude}),
      headers: {
        authorization: "Bearer " + session.data.user.accessToken,
      },
    });

    const res = await data.json();

    if (res.error === "Location already exists") {
      message.error("Location already exists");
      clearFields();
      return;
    }
    mutate([...locations, form]);

    message.success("Location created");
    clearFields();
  };

  const editLocation = async () => {
    setLocationModal(false);
    const data = await fetch(`/api/locations/${id}`, {
      method: "PUT",
      body: JSON.stringify(form),
      headers: {
        authorization: "Bearer " + session.data.user.accessToken,
      },
    });
    const res = await data.json();

    if (res.error === "Location already exists") {
      message.error("Location already exists");
      clearFields();
      return;
    }
    mutate([...locations]);

    message.success("Location updated");
    clearFields();
  };

  const deleteLocation = async () => {
    setLocationModal(false);
    await fetch(`/api/locations/${id}`, {
      method: "DELETE",
      headers: {
        authorization: "Bearer " + session.data.user.accessToken,
      },
    });
    mutate([...locations]);

    message.success("Location deleted");
  };

  const handleAction = (type, data) => {
    setActionType(type);

    if (type === "edit") {
      setId(data._id);
      const newForm = {
        name: data.name,
        address: data.address,
        isSetted: true,
      };
      setAddress(data.address);
      setLatitude(Number(data.latitude));
      setLongitude(Number(data.longitude));
      setForm(newForm);

    }

    if (type === "delete") {
      setId(data);
    }

    setLocationModal(true);
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
              placeholder="Location name"
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
              Locations ({locations?.length})
            </p>

            <div className="h-full w-full mt-6 grid grid-cols-4 gap-6">
            {locations &&
              locations.map((x, index) => (
                <div key={index} className="h-full w-full mt-6">
                  <div className="h-[250px] border-[1px] border-[#E5E5E3]">
                    <div className="px-4 py-4 flex justify-between">
                      <div className="flex flex-col">
                        <p>{x.name}</p>
                        <p className="mt-2 text-xs font-light">{x.address}</p>
                        {/* <p className="mt-5">+1 212 435 6466</p> */}
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
                </div>
              ))}
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
            onClick={() => setLocationModal(false) & setAddress(null) & setLatitude(24.432928) & setLongitude(54.644539)}
          >
            CANCEL
          </button>,
          <button
            onClick={
              actionType === "edit"
                ? editLocation
                : actionType === "add"
                ? addLocation
                : deleteLocation
            }
            className="bg-black text-white rounded-sm px-4 py-1 hover:opacity-80"
            key="submit"
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
            ? "Edit Location"
            : actionType === "add"
            ? "Create Location"
            : "Delete Location"
        }
        open={locationModal}
        onCancel={() => setLocationModal(false) & setAddress(null) & setLatitude(24.432928) & setLongitude(54.644539)}
      >
        {actionType !== "delete" && (
          <>
            <div className="mt-4">
              <span className="text-xs font-semibold">LOCATION NAME</span>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => {
                    return { ...prev, name: e.target.value };
                  })
                }
                className="rounded-none border-t-0 border-l-0 border-r-0"
                placeholder="e.g My Location"
              />
            </div>

            <div className="mt-4">
              <span className="text-xs font-semibold">ADDRESS</span>
              <PlaceComponent isSetted={form.isSetted} address={address} setAddress={setAddress} setLatitude={setLatitude} setLongitude={setLongitude} style="w-full px-2 py-1 border-b-[1px] border-[#E5E5E3]" />
              {/* <Input
                value={form.address}
                onChange={(e) =>
                  setForm((prev) => {
                    return { ...prev, address: e.target.value };
                  })
                }
                className="rounded-none border-t-0 border-l-0 border-r-0"
                placeholder="e.g Silicon Valley B.320"
              /> */}
            </div>

            <div className="mt-2 px-1 py-1 border-[1px] border-[#E5E5E3]">
              <GoogleMaps isSetted={form.isSetted} latitude={latitude} longitude={longitude} setLatitude={setLatitude} setLongitude={setLongitude} />
            </div>


          </>
        )}

        {actionType === "delete" && (
          <div>
            <p>Are you sure want to delete this location?</p>
          </div>
        )}
      </Modal>

      <button
        onClick={() =>
          setLocationModal(true) & setActionType("add") & clearFields()
        }
        className="hover:opacity-80 transition duration-300 absolute bottom-10 right-10 w-[180px] h-[40px] bg-black text-white rounded-full text-[14px]"
      >
        + CREATE LOCATION
      </button>
    </ConfigProvider>
  );
};

export default Location;
