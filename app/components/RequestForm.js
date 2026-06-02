"use client";

import { useRequestForm, SERVICE_OPTIONS } from "./useRequestForm";
import RequestSidebar from "./RequestSidebar";
import { useLanguage } from "./LanguageProvider";

export default function RequestForm() {
  const { t, dir, lang, translateService } = useLanguage();
  const {
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
    currentCustomer,
    name, setName,
    phone, setPhone,
  } = useRequestForm();

  const inputClass =
    "w-full p-3 rounded-xl bg-gray-50 border border-slate-400 text-gray-900 outline-none focus:border-red-500 focus:bg-white transition placeholder:text-gray-400";

  const copyRequestNumber = async () => {
    try {
      await navigator.clipboard.writeText(successRequestNumber);
      alert(lang === "ar" ? "تم نسخ رقم الطلب ✅" : "Order number copied ✅");
    } catch {
      alert(lang === "ar" ? "تعذر النسخ، احفظ الرقم يدوياً" : "Couldn't copy, save the number manually");
    }
  };

  if (successRequestNumber) {
    return (
      <main className="min-h-screen bg-white text-gray-900 px-4 py-12 md:px-6 flex items-center justify-center" dir={dir}>
        <div className="max-w-2xl w-full">
          <div className="bg-white border-2 border-green-300 rounded-3xl p-8 md:p-10 shadow-xl text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-14 h-14 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-green-700 mb-3">
              {t("request.successTitle")}
            </h1>
            <p className="text-gray-600 text-base md:text-lg leading-8 mb-8 whitespace-pre-line">
              {currentCustomer ? t("request.successDescAccount") : t("request.successDescGuest")}
            </p>

            {!currentCustomer && (
              <div className={`bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-5 mb-6 ${dir === "rtl" ? "text-right" : "text-left"}`}>
                <p className="text-yellow-900 font-black text-base mb-2 flex items-center gap-2">
                  {t("request.saveOrderTitle")}
                </p>
                <p className="text-yellow-800 text-sm leading-7 whitespace-pre-line">
                  {t("request.saveOrderDesc")}
                </p>
              </div>
            )}

            <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 mb-6">
              <p className="text-sm text-gray-500 mb-2 font-bold">{t("request.orderNumber")}</p>
              <p className="text-3xl md:text-4xl font-black text-gray-900 tracking-wider mb-4 break-all">
                {successRequestNumber}
              </p>
              <button onClick={copyRequestNumber}
                className="bg-gray-900 hover:bg-gray-800 text-white text-sm px-5 py-2.5 rounded-xl font-bold transition">
                {t("request.copyNumber")}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={`/my-orders?ref=${successRequestNumber}`}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-2xl font-black transition shadow-lg shadow-green-500/20">
                {t("request.trackOrder")}
              </a>

              {!currentCustomer && (
                <a href="/signup"
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-2xl font-black transition shadow-lg shadow-red-500/20">
                  {t("request.createAccountSave")}
                </a>
              )}

              <a href="/" className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-6 py-4 rounded-2xl font-bold transition">
                {t("request.goHome")}
              </a>
            </div>

            <button onClick={() => window.location.reload()}
              className="mt-6 text-gray-500 hover:text-gray-700 text-sm font-bold underline transition">
              {t("request.newOrder")}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-900 px-4 py-12 md:px-6" dir={dir}>
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-10">
          <span className="bg-red-50 text-red-500 font-bold text-sm px-4 py-2 rounded-full">RoadFix</span>
          <h1 className="text-3xl md:text-5xl font-black mt-4 mb-4">{t("request.pageTitle")}</h1>
          <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-8">
            {t("request.pageSubtitle")}
          </p>
        </div>

        {formMessage.text && formMessage.type === "error" && (
          <div className={messageBoxClass}>
            <p className="font-bold">{formMessage.text}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6 items-start">

          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-5 md:p-8 shadow-sm">
            <div className="flex flex-col gap-4 mb-6 pb-6 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-black">{t("request.formTitle")}</h2>
                <p className="text-gray-500 mt-2">{t("request.formSubtitle")}</p>
              </div>

              {currentCustomer && (
                <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4">
                  <p className="text-sm text-green-700 mb-1 font-bold">{t("request.welcomeBack")}</p>
                  <p className="text-base text-green-800 leading-8">{t("request.welcomeDesc")}</p>
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-4">
                <p className="text-sm text-yellow-700 mb-1 font-bold">{t("request.importantInfo")}</p>
                <p className="text-base font-bold text-yellow-800 leading-8">{t("request.importantDesc")}</p>
              </div>
            </div>

            {service && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4">
                <p className="text-red-600 font-bold text-lg">{t("request.serviceSelected")} {translateService(service)}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>

              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                <h3 className="text-lg font-black text-gray-900 mb-4">{t("request.serviceType")}</h3>
                <select value={service} onChange={(e) => setService(e.target.value)} className={inputClass}>
                  <option value="">{t("request.selectService")}</option>
                  {SERVICE_OPTIONS.map((item) => (
                    <option key={item} value={item}>{translateService(item)}</option>
                  ))}
                </select>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                <h3 className="text-lg font-black text-gray-900 mb-4">{t("request.customerData")}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm text-gray-600 font-bold">
                      {t("request.name")}
                      {currentCustomer && <span className="text-green-600 text-xs mr-2 ml-2">{t("request.fromAccount")}</span>}
                    </label>
                    <input name="name" placeholder={t("request.namePlaceholder")} value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-gray-600 font-bold">
                      {t("request.phone")}
                      {currentCustomer && <span className="text-green-600 text-xs mr-2 ml-2">{t("request.fromAccount")}</span>}
                    </label>
                    <input name="phone" inputMode="numeric" placeholder={t("request.phonePlaceholder")} value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block mb-2 text-sm text-gray-600 font-bold">{t("request.description")}</label>
                  <textarea name="description" placeholder={t("request.descriptionPlaceholder")} className={`${inputClass} h-28`} />
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                <h3 className="text-lg font-black text-gray-900 mb-4">{t("request.carData")}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input name="carBrand" placeholder={t("request.carBrandPlaceholder")} className={inputClass} />
                  <input name="carModel" placeholder={t("request.carModelPlaceholder")} className={inputClass} />
                  <input name="carYear" inputMode="numeric" placeholder={t("request.carYearPlaceholder")} className={inputClass} />
                  <input name="plateNumber" placeholder={t("request.plateNumberPlaceholder")} className={inputClass} />
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h3 className="text-lg font-black text-gray-900">{t("request.location")}</h3>
                  <span className="text-xs text-gray-400">{t("request.gpsOrManual")}</span>
                </div>

                <button type="button" onClick={getLocation} disabled={loadingLocation}
                  className="w-full bg-slate-900 hover:bg-slate-800 p-3 rounded-xl font-bold text-white transition disabled:opacity-60">
                  {loadingLocation ? t("request.detectingLocation") : t("request.detectLocation")}
                </button>

                {location && (
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-sm space-y-1">
                    <p className="font-bold">{t("request.locationDetected")}</p>
                    <p>Lat: {location.lat} | Lng: {location.lng}</p>
                  </div>
                )}

                {locationMessage && !location && (
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                    <p className="text-yellow-700 font-bold mb-2">{t("request.locationFailed")}</p>
                    <p className="text-sm text-yellow-800 leading-7">{locationMessage}</p>
                  </div>
                )}

                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-2xl p-4">
                  <p className="text-blue-700 font-bold mb-2">{t("request.backupTitle")}</p>
                  <p className="text-sm text-blue-800 leading-7 mb-4">{t("request.backupDesc")}</p>
                  <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold transition">
                    {t("request.openMaps")}
                  </a>
                </div>

                <div className="mt-4 bg-white border border-dashed border-gray-300 rounded-2xl p-4">
                  <label className="block text-sm text-gray-700 mb-2 font-bold">{t("request.manualAddressLabel")}</label>
                  <p className="text-xs text-gray-400 mb-3 leading-6">{t("request.manualAddressHelp")}</p>
                  <textarea value={manualAddress} onChange={(e) => setManualAddress(e.target.value)}
                    placeholder={t("request.manualAddressPlaceholder")} className={`${inputClass} h-28`} />
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                <h3 className="text-lg font-black text-gray-900 mb-4">{t("request.damagePhoto")}</h3>
                <input type="file" accept="image/*" onChange={handleImageChange}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-red-50 file:text-red-600 file:font-bold" />
                {selectedImage && <p className="text-green-600 text-sm mt-3">{t("request.photoSelected")} {selectedImage.name}</p>}
                {imagePreview && (
                  <div className="mt-4">
                    <img src={imagePreview} alt="Preview" className="w-full max-h-72 object-cover rounded-2xl border border-gray-200" />
                  </div>
                )}
                <p className="text-yellow-600 text-sm mt-3 leading-7">{t("request.photoNote")}</p>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                <h3 className="text-lg font-black text-gray-900 mb-4">{t("request.paymentMethod")}</h3>
                <select name="paymentMethod" className={inputClass} defaultValue="كاش">
                  <option value="كاش">{t("request.cash")}</option>
                  <option value="تحويل">{t("request.transfer")}</option>
                </select>
              </div>

              <button type="submit" disabled={submitting}
                className="w-full bg-red-500 hover:bg-red-600 text-white p-4 rounded-2xl font-black text-lg transition-all hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-red-500/20">
                {submitting ? t("request.submitting") : t("request.submit")}
              </button>
            </form>
          </div>

          <RequestSidebar />

        </div>
      </div>
    </main>
  );
}