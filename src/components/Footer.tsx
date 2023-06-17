import React from 'react';
import LicenseForm from '@/components/licenseForm';
import {useAtom} from 'jotai';
import {useQueryUserInfo, userPlanAtom} from '@/hooks/useQueryUserInfo';
import {useThrottleFn} from 'ahooks';
import { useInView } from 'react-intersection-observer';
import {showEnterLicense, showBackBottomBtn} from '@/hooks/useLayout';
export function Footer() {
    const [editing, setEditing] = useAtom(showEnterLicense);
    const [tokensText, setTokensText] = useState('');
    const { data, refetch, isSuccess, ifFree } = useQueryUserInfo();
    const [, setUserPlan] = useAtom(userPlanAtom);
    const [,setShowBottomBtn] = useAtom(showBackBottomBtn)
    const { ref: inViewRef, inView } = useInView({
        /* Optional options */
        threshold: 0,
    });

    useEffect(() => {
        return () => {
            setShowBottomBtn(inView)
        };
    }, [inView]);

    let tokens = 0;
    let plan = '';

    useEffect(() => {
        smoothToBottom.run();
    }, [editing]);

    const smoothToBottom = useThrottleFn(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, { wait: 400 });

    useEffect(() => {
        if (!data) return;
        const { plan, total, left } = data;
        setUserPlan(plan);
        let tokens = left <= 0 ? 0 : left;
        if (!ifFree) {
            setTokensText(`${tokens} Tokens`);
        } else {
            setTokensText(`${tokens} Tokens / Day`);
        }
    }, [data, ifFree]);

    return (
        <footer ref={inViewRef} >
            <p className="mt-2 text-xs op-60">
                <span className="">{ ifFree ? 'Free Plan' : 'Paid Plan' }</span>
                <span className="px-1"> | </span>
                <span className="">Left: </span>
                { isSuccess && <>
                    <a
                        className="b-slate-link"
                        onClick={ () => setEditing(!editing) }
                        rel="noopener noreferrer"
                    >
                        { tokensText }
                    </a>
                </> }
                {
                    !isSuccess && <a className="b-slate-link " href="#"
                                     onClick={ () => setEditing(!editing) }>Loading...</a>
                }
                <span className="px-1"> | </span>
                <a
                    className="b-slate-link"

                    onClick={ () => setEditing(!editing) }
                    rel="noopener noreferrer"
                >
                    Check License
                </a>
            </p>
            {
                editing && <LicenseForm/>
            }


        </footer>
    );
}
