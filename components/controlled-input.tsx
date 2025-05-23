import { Input } from "./ui/input";
import { Label } from "./ui/label";

const ControlledInput = ({
    id,
    label,
    type,
    value,
    onChange,
    remark,
    placeholder,
}: {
    id: string,
    label: string,
    type: 
        "text" | "email" | "password" | 
        "textarea",
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    remark?: string,
    placeholder?: string,
}) => {
    return (
        <div className="flex flex-col space-y-0.5 w-full">
            <Label 
                htmlFor={id} 
                className='text-base font-normal'
            >
                {label}
                {remark && (
                    <span className="text-sm text-slate-400 ml-1 font-thin">
                        {remark}
                    </span>
                )}
            </Label>
            <Input 
                name={id}
                id={id} 
                type={type} 
                placeholder={placeholder || ("請輸入"+label)} 
                value={value}
                onChange={onChange}
                className="bg-white border-slate-300" 
            />
        </div>
    );
}
 
export default ControlledInput;