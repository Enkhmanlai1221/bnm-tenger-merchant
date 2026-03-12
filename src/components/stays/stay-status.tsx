import { PROPERTY_STATUS } from "@/interfaces/property";
import { useLanguage } from "@/providers/language";
import { Chip } from "@heroui/react";

export const PropertyStatus = ({ status }: { status: PROPERTY_STATUS }) => {
  const { translate } = useLanguage();
  return (
    <div>
      {
        {
          [PROPERTY_STATUS.PENDING]: (
            <Chip color="warning" variant="dot" size="sm">
              {translate("pending")}
            </Chip>
          ),
          [PROPERTY_STATUS.NEW]: (
            <Chip color="default" variant="dot" size="sm">
              {translate("new")}
            </Chip>
          ),
          [PROPERTY_STATUS.CANCELED]: (
            <Chip color="danger" variant="dot" size="sm">
              {translate("canceled")}
            </Chip>
          ),
          [PROPERTY_STATUS.CONFIRMED]: (
            <Chip color="success" variant="dot" size="sm">
              {translate("confirmed")}
            </Chip>
          ),
        }[status]
      }
    </div>
  );
};
