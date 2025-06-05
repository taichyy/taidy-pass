import { Input } from "./ui/input";
import { Label } from "./ui/label";

const UncontrolledInput = ({
    id,
    label,
    type,
    remark,
    placeholder,
    defaultValue,
    required = false
}: {
    id: string,
    label: string,
    type: string,
    remark?: string,
    placeholder?: string,
    defaultValue?: string,
    required?: boolean
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
                id={id} 
                type={type} 
                placeholder={placeholder || ("請輸入"+label)} 
                className="bg-white border-slate-300" 
                defaultValue={defaultValue}
                required={required}
            />
        </div>
    );
}
 
export default UncontrolledInput;