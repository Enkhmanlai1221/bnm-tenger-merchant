"use client";

import { mediaApi, merchantApi } from "@/apis";
import { Container } from "@/components/ui/page-layout/container";
import { RenderTiptap } from "@/components/ui/render-tiptap/render-tiptap";
import { IUser } from "@/interfaces/user";
import { useLanguage } from "@/providers/language";
import { cn } from "@/utils";
import { ErrorMessage } from "@/utils/http/http-handler";
import { message } from "@/utils/message";
import { Button, Checkbox } from "@heroui/react";
import { IconCheck } from "@tabler/icons-react";
import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import useSWR from "swr";

export function MerchantContract({
  user,
  onSuccess,
}: {
  user: IUser;
  onSuccess?: () => void;
}) {
  const { translate } = useLanguage();
  const [loading, setLoading] = useState(false);
  const signatureRef = useRef<SignatureCanvas | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isSigned, setIsSigned] = useState(false);
  const [isAgree, setIsAgree] = useState(false);

  const { data, isLoading } = useSWR(
    `swr.merchant.contract.detail`,
    () => merchantApi.contract({}),
    {
      revalidateOnFocus: false,
    }
  );

  const dataURLtoBlob = async (dataURL: string) => {
    const res = await fetch(dataURL);
    return await res.blob();
  };

  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setIsSigned(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!isSigned) return;

    if (signatureRef.current) {
      const signatureData = signatureRef.current.toDataURL();

      if (!signatureData) return;

      try {
        const formData = new FormData();
        const blob = await dataURLtoBlob(signatureData);
        formData.append("file", blob, "signature.png");

        const res = await mediaApi.upload(formData);

        await merchantApi.sign({
          signature: res?.url,
        });

        onSuccess?.();

        containerRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      } catch (error) {
        message.error((error as ErrorMessage).message);
      } finally {
        setLoading(false);
      }

    }
  };

  const alreadySigned = !!user?.contract;

  if (isLoading) {
    return (
      <Container>
        <div className="py-12">
          <p className="text-center text-gray-500">
            {translate("loading", "Loading...")}
          </p>
        </div>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container>
        <div className="py-12">
          <p className="text-center text-gray-500">
            {translate("not_found", "Not found")}
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div ref={containerRef}>
        {alreadySigned && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-green-300 bg-green-50 p-4 text-green-800 shadow-sm">
            <IconCheck size={20} className="mt-0.5 flex-shrink-0 text-green-600" />
            <div>
              <p className="font-medium text-sm sm:text-base">
                {translate(
                  "contract_already_signed",
                  "Contract already signed"
                )}
              </p>
              <p className="text-xs sm:text-sm text-green-700">
                {translate(
                  "signed_the_collaboration_contract",
                  "You have already signed the collaboration contract. No further action is required."
                )}
              </p>
            </div>
          </div>
        )}

        <RenderTiptap content={data.text} />

        {!alreadySigned && (
          <>
            <div className="mt-4">
              <label className="block mb-2 text-sm sm:text-md font-bold">
                {translate("sign_here", "Sign here")}:
              </label>
              <div className="w-full max-w-full sm:max-w-md">
                <SignatureCanvas
                  backgroundColor="white"
                  ref={signatureRef}
                  penColor="black"
                  canvasProps={{
                    width: 500,
                    height: 200,
                    className:
                      "signature-canvas w-full border rounded shadow overflow-hidden",
                  }}
                  onEnd={() => {
                    if (!signatureRef.current?.isEmpty()) {
                      setIsSigned(true);
                    }
                  }}
                />
              </div>
            </div>

            <div className="mt-2">
              <Checkbox
                size="lg"
                checked={isAgree}
                onChange={(e) => setIsAgree(e.target.checked)}
                classNames={{
                  label: cn(
                    "text-xs sm:text-sm text-gray-500 leading-4",
                    !isAgree && "text-red-500"
                  ),
                }}
              >
                {translate(
                  "reviewed_the_collaboration_agreement",
                  "I have fully reviewed the collaboration agreement and accept all its terms"
                )}
              </Checkbox>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row justify-end sm:space-x-3 space-y-2 sm:space-y-0">
              <Button onPress={clearSignature} className="w-full sm:w-auto">
                {translate("clear_signature", "Clear signature")}
              </Button>
              <Button
                isLoading={loading}
                onPress={handleSubmit}
                disabled={!isSigned || !isAgree}
                className={`w-full sm:w-auto transition-colors duration-200 ${!isSigned || !isAgree
                  ? "bg-gray-400 cursor-not-allowed text-gray-700"
                  : "bg-[#326144] hover:bg-[#274f34] text-white"
                  }`}
              >
                {translate(
                  "agree_and_confirm_contract",
                  "Agree and Confirm Contract"
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </Container>
  );
}
