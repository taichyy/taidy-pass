import { Input } from "./ui/input";
import { Label } from "./ui/label";

const UncontrolledInput = (props: {
    id: string,
    label: string,
    type: string,
    remark?: string,
    placeholder?: string,
    defaultValue?: string,
    required?: boolean,
}) => {
    const { id, label, type, remark, placeholder, defaultValue, required = false } = props;

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
                className="bg-white dark:bg-gray-900 border-slate-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" 
                defaultValue={defaultValue}
                required={required}
            />
        </div>
    );
};
 
export default UncontrolledInput;