import { useState, useCallback } from 'react';

/**
 * Promise의 로딩 상태를 쉽게 관리할 수 있게 해주는 훅
 * @returns {[boolean, function]} [isLoading, startLoading]
 */
export const useLoading = () => {
    // 로딩 상태 관리 state
    const [isLoading, setIsLoading] = useState(false);
    
    // 로딩 상태를 처리하는 콜백함수
    const startLoading = useCallback(async (promise) => {
        try {
            setIsLoading(true);
            const result = await promise;
            return result;
        } catch (error) {
            // 에러는 그대로 던져서 호출한 곳에서 처리하도록
            throw error; 
        } finally {
        // 성공/실패 관계없이 로딩 상태 해제
        setIsLoading(false);
        }
    }, []);
    return [isLoading, startLoading];
};

export default useLoading;
