"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export const SERVICE_OPTIONS = [
  "بطارية",
  "كاوتش",
  "بنزين",
  "كهرباء",
  "ميكانيكا",
  "صيانة دورية",
  "عطل",
];

// كل منطق صفحة الطلب في مكان واحد
export function useRequestForm() {
  const searchParams = useSearchParams();
  const selectedServiceFromUrl = searchParams.get("service") || "";

  const [service, setService] = useState("");
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [manualAddress, setManualAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");
  const [formMessage, setFormMessage] = useState({ type: "", text: "" });
  const [successRequestNumber, setSuccessRequestNumber] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (
      selectedServiceFromUrl &&
      SERVICE_OPTIONS.includes(selectedServiceFromUrl)
    ) {
      setService(selectedServiceFromUrl);
    }
  }, [selectedServiceFromUrl]);

  const getLocationErrorMessage = (error) => {
    if (!error) {
      return "تعذر تحديد موقعك الآن، لكن لا تقلق، يمكنك كتابة عنوانك يدويًا وسيتم تسجيل الطلب بشكل طبيعي.";
    }
    if (error.code === 1) {
      return "تم رفض إذن الموقع. يمكنك السماح بإذن الموقع من المتصفح، أو ببساطة كتابة عنوانك يدويًا وإكمال الطلب.";
    }
    if (error.code === 2) {
      return "تعذر الوصول لموقعك حاليًا. اكتب عنوانك يدويًا بشكل واضح وسيتم استلام الطلب عادي.";
    }
    if (error.code === 3) {
      return "استغرق تحديد الموقع وقتًا أطول من اللازم. حاول مرة أخرى أو اكتب عنوانك يدويًا في الخانة بالأسفل.";
    }
    return "تعذر تحديد موقعك الآن. اكتب عنوانك يدويًا في الخانة بالأسفل وسيتم إرسال الطلب بشكل طبيعي.";
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage(
        "هذا المتصفح لا يدعم تحديد الموقع. اكتب عنوانك يدويًا بالأسفل وسيتم إرسال الطلب بشكل طبيعي."
      );
      return;
    }

    setLoadingLocation(true);
    setLocationMessage("");
    setFormMessage({ type: "", text: "" });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoadingLocation(false);
        setLocationMessage("تم تحديد موقعك بنجاح ✅");
      },
      (firstError) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            setLoadingLocation(false);
            setLocationMessage("تم تحديد موقعك بنجاح ✅");
          },
          (secondError) => {
            setLoadingLocation(false);
            setLocation(null);
            setLocationMessage(getLocationErrorMessage(secondError || firstError));
          },
          { enableHighAccuracy: false, timeout: 15000, maximumAge: 30000 }
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const generateRequestNumber = () => `RF-${Date.now()}`;

  const validateEgyptPhone = (phone) => {
    const normalized = phone.replace(/\s+/g, "");
    return /^01[0-2,5][0-9]{8}$/.test(normalized);
  };

  const validateCarYear = (year) => {
    if (!year) return true;
    const numericYear = Number(year);
    const currentYear = new Date().getFullYear() + 1;
    return numericYear >= 1950 && numericYear <= currentYear;
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setSelectedImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview("");
    }
  };

  const messageBoxClass = useMemo(() => {
    if (formMessage.type === "success") {
      return "mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 text-green-700";
    }
    if (formMessage.type === "error") {
      return "mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700";
    }
    return "";
  }, [formMessage.type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage({ type: "", text: "" });
    setSuccessRequestNumber("");

    const form = e.target;
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const description = form.description.value.trim();
    const carBrand = form.carBrand.value.trim();
    const carModel = form.carModel.value.trim();
    const carYear = form.carYear.value.trim();
    const plateNumber = form.plateNumber.value.trim();
    const paymentMethod = form.paymentMethod.value;

    if (!service) {
      setFormMessage({ type: "error", text: "من فضلك اختر نوع الخدمة أولًا." });
      return;
    }
    if (!name || !phone || !description) {
      setFormMessage({ type: "error", text: "من فضلك املى الاسم ورقم الموبايل ووصف العطل." });
      return;
    }
    if (!validateEgyptPhone(phone)) {
      setFormMessage({ type: "error", text: "من فضلك اكتب رقم موبايل مصري صحيح مكوّن من 11 رقم." });
      return;
    }
    if (!validateCarYear(carYear)) {
      setFormMessage({ type: "error", text: "من فضلك اكتب سنة صنع صحيحة." });
      return;
    }
    if (!location && !manualAddress.trim()) {
      setFormMessage({ type: "error", text: "حدد موقعك أو اكتب عنوانك يدويًا قبل إرسال الطلب." });
      return;
    }

    try {
      setSubmitting(true);
      const requestNumber = generateRequestNumber();

      await addDoc(collection(db, "requests"), {
        requestNumber,
        service,
        name,
        phone,
        description,
        carBrand: carBrand || null,
        carModel: carModel || null,
        carYear: carYear || null,
        plateNumber: plateNumber || null,
        paymentMethod,
        status: "new",
        location: location || null,
        manualAddress: manualAddress.trim() || null,
        imageName: selectedImage ? selectedImage.name : null,
        imageUrl: null,
        createdAt: new Date(),
      });

      setSuccessRequestNumber(requestNumber);
      setFormMessage({
        type: "success",
        text: "تم إرسال الطلب بنجاح ✅ احتفظ برقم الطلب لمتابعة الحالة.",
      });

      form.reset();
      setLocation(null);
      setSelectedImage(null);
      setManualAddress("");
      setLocationMessage("");
      setImagePreview("");
      setService(selectedServiceFromUrl || "");
    } catch (error) {
      console.error(error);
      setFormMessage({ type: "error", text: "حصل خطأ أثناء إرسال الطلب. حاول مرة أخرى." });
    } finally {
      setSubmitting(false);
    }
  };

  // نرجّع كل اللي الفورم محتاجه
  return {
    service, setService,
    location,
    loadingLocation,
    selectedImage,
    manualAddress, setManualAddress,
    submitting,
    locationMessage,
    formMessage,
    successRequestNumber,
    imagePreview,
    getLocation,
    handleImageChange,
    handleSubmit,
    messageBoxClass,
  };
}