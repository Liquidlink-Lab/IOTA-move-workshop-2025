"use client";

import { useWhitelist } from "@/hooks/use-whitelist";

export const Whitelist = () => {
  const { data } = useWhitelist();

  return (
    <>
      <div>Whitelist Component</div>
      {data?.admin} {data?.state ? "Enabled" : "Disabled"}
      <div>Allowed Entries({data?.allowed.length}):</div>
      {data?.allowed.map((entry) => (
        <div key={entry.address} className="m-8">
          <p>{entry.address}</p>
          <p>{entry.name}</p>
        </div>
      ))}
    </>
  );
};
