import { authApi, notificationApi } from "@/apis";
import { IGerNotification } from "@/interfaces/ger-notfication";
import { DataListData } from "../ui/datalist/list";
import { GerNotifyCard } from "./ger-notify-card";

export function PreListNotfication() {
  return (
    <DataListData
      loadData={(filter) => notificationApi.list(filter)}
      name="swr.notifications.list.paginate"
      filters={{}}
      onLoaded={() => {
        authApi.me();
      }}
      pagination={false}
    >
      {({ data }) => (
        <ul role="list" className="max-h-[560px] overflow-y-auto">
          {data.rows.map((item: IGerNotification, index: number) => (
            <li key={index} className="py-1">
              <GerNotifyCard payload={item} key={item._id} />
            </li>
          ))}
        </ul>
      )}
    </DataListData>
  );
}
