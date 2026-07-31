"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MapPin, User, Phone, Mail } from "lucide-react";
import { useEffect } from "react";

const addressSchema = z.object({
  firstName: z.string().min(2, "First name is too short"),
  lastName: z.string().min(2, "Last name is too short"),
  phone: z.string().min(10, "Invalid phone number"),
  email: z.string().email("Invalid email address"),
  country: z.string().min(2, "Country is required"),
  state: z.string().min(2, "State is required"),
  city: z.string().min(2, "City is required"),
  pincode: z.string().min(5, "Invalid pincode"),
  street: z.string().min(5, "Street address is too short"),
  apartment: z.string().optional(),
  landmark: z.string().optional(),
  addressType: z.enum(["home", "office", "other"]),
  saveAddress: z.boolean(),
  billingSameAsShipping: z.boolean(),
});

export type AddressFormData = z.infer<typeof addressSchema>;

export default function AddressForm({ defaultValues, onNext }: { defaultValues: any, onNext: (data: AddressFormData) => void }) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      addressType: "home",
      saveAddress: true,
      billingSameAsShipping: true,
      country: "India",
      ...defaultValues
    }
  });

  const addressType = watch("addressType");

  const InputField = ({ label, id, icon: Icon, type = "text", ...rest }: { label: string, id: keyof AddressFormData, icon: any, type?: string, [key: string]: any }) => (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-rose-500 transition-colors">
        <Icon size={18} />
      </div>
      <input
        type={type}
        id={id}
        placeholder=" "
        className={`peer w-full pl-11 pr-4 py-3.5 bg-neutral-50/50 border-2 rounded-xl outline-none transition-all
          ${errors[id] ? 'border-red-300 focus:border-red-500 bg-red-50/20' : 'border-neutral-200 hover:border-neutral-300 focus:border-rose-500 focus:bg-white'}
        `}
        {...register(id)}
        {...rest}
      />
      <label
        htmlFor={id}
        className={`absolute left-11 text-sm transition-all pointer-events-none
          peer-focus:-translate-y-[18px] peer-focus:text-xs peer-focus:text-rose-500 peer-focus:bg-white peer-focus:px-1
          peer-[:not(:placeholder-shown)]:-translate-y-[18px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1
          ${errors[id] ? 'text-red-500' : 'text-neutral-500'}
          top-3.5
        `}
      >
        {label}
      </label>
      {errors[id] && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors[id]?.message as string}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="bg-white rounded-[20px] p-6 sm:p-8 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] border border-neutral-100">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
          <MapPin className="text-rose-500" /> Shipping Details
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InputField id="firstName" label="First Name" icon={User} />
          <InputField id="lastName" label="Last Name" icon={User} />
          <InputField id="email" label="Email Address" icon={Mail} type="email" />
          <InputField id="phone" label="Phone Number" icon={Phone} type="tel" />
          <InputField id="street" label="Street Address" icon={MapPin} />
          <InputField id="apartment" label="Apartment / Suite (Optional)" icon={MapPin} />
          <InputField id="city" label="City" icon={MapPin} />
          <div className="grid grid-cols-2 gap-5">
            <InputField id="state" label="State" icon={MapPin} />
            <InputField id="pincode" label="PIN Code" icon={MapPin} />
          </div>
          <InputField id="landmark" label="Landmark (Optional)" icon={MapPin} />
        </div>

        <div className="mt-8">
          <p className="text-sm font-bold text-neutral-900 mb-3">Address Type</p>
          <div className="flex gap-4">
            {['home', 'office', 'other'].map(type => (
              <label key={type} className={`flex-1 flex justify-center cursor-pointer items-center py-3 px-4 rounded-xl border-2 transition-all capitalize font-medium ${addressType === type ? 'border-rose-500 bg-rose-50/50 text-rose-700' : 'border-neutral-100 hover:border-neutral-200 text-neutral-600'}`}>
                <input type="radio" value={type} {...register("addressType")} className="hidden" />
                {type}
              </label>
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-4 border-t border-neutral-100 pt-6">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center w-5 h-5">
              <input type="checkbox" {...register("saveAddress")} className="peer appearance-none w-5 h-5 border-2 border-neutral-300 rounded focus:ring-2 focus:ring-rose-500/20 checked:border-rose-500 checked:bg-rose-500 transition-colors" />
              <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <span className="text-sm text-neutral-600 font-medium group-hover:text-neutral-900 transition-colors">Save this address for future checkouts</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center w-5 h-5">
              <input type="checkbox" {...register("billingSameAsShipping")} className="peer appearance-none w-5 h-5 border-2 border-neutral-300 rounded focus:ring-2 focus:ring-rose-500/20 checked:border-rose-500 checked:bg-rose-500 transition-colors" />
              <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <span className="text-sm text-neutral-600 font-medium group-hover:text-neutral-900 transition-colors">Billing address is same as shipping</span>
          </label>
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <button type="submit" className="w-full sm:w-auto px-10 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-lg shadow-[0_8px_20px_-8px_rgba(225,29,72,0.5)] active:scale-[0.98] transition-all">
          Continue to Shipping
        </button>
      </div>
    </form>
  );
}
