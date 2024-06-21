import { ref, computed, onBeforeUnmount, type Ref, inject } from "vue";
import FakeProgress from "fake-progress";
import { ElMessage } from 'element-plus'
import qs from 'qs';
interface IUseFakeProgress {
    progress: Ref<number>;
    percentage: Ref<number>;
    start: () => void;
    end: () => void;
}

/**
 * useFakeProgress Hook
 *
 * @param {number} [timeConstant=50000] - 默认timeConstant为5000，单位毫秒
 * @param {boolean} [autoStart=false] - 是否自动开始，默认为false
 * @return {IUseFakeProgress}
 */
export function useRealProgress(postData: any) {
    const percentage = ref<number>(0)
    const progress = ref<number>(0)
    const successCount = ref<number>(0)
    const url = 'http://localhost:21408/RoadFlowApi/Invoice/OpenInvoice'
    function fetchData(): Promise<number> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', url);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.setRequestHeader("Nroadflow-Clientid", getCookie("nroadflow-clientid"));
            xhr.setRequestHeader("Nroadflow-Token", getCookie("nroadflow-token"));
            xhr.onprogress = function (event) {
                console.log(event);
                if (!event.lengthComputable) {
                    const percentComplete = event.loaded / event.total * 100;
                    progress.value = percentComplete;
                    percentage.value = parseInt(percentComplete.toString());
                }
            };
            xhr.onload = function () {
                if (this.status === 200) {
                    const contentLength = this.getResponseHeader('Content-Length');
                    console.log(`Content-Length: ${contentLength}`);
                    // 这里你可能需要处理服务器返回的错误
                    resolve(100);
                    percentage.value = 100;
                    successCount.value++
                } else {
                    reject(new Error("接口调用失败"));
                }
            };
            xhr.onerror = function () {
                reject(new Error("接口调用失败"));
            };
            xhr.send(JSON.stringify(postData));
        });
    }
    const start = async () => {
        try {
            percentage.value = 0
            successCount.value = 0
            await fetchData();
        } catch (error) {
            console.error(error);
            alert('接口调用失败，请稍后再试');
        }
    };
    function getCookie(name: string) {
        const value = "; " + document.cookie;
        const parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop()?.split(";").shift();
    }
    return {
        successCount,
        progress,
        percentage,
        start,
    };
}

export function useFakeProgress(
    timeConstant?: number,
    autoStart?: boolean,
    // fetchDataFunc: () => Promise<number> = fetchData,  // 添加新的参数
): IUseFakeProgress {
    const fake = new FakeProgress({
        timeConstant: timeConstant || 50000,
        autoStart,
    });
    const progress = ref(fake.progress);
    const percentage = computed(() => parseInt(progress.value * 100 + ""));// 保留一位小数
    let timerInterval: ReturnType<typeof setInterval> | null;
    if (autoStart) {
        setTimerInterval();
    }

    onBeforeUnmount(() => {
        clearTimerInterval();
    });

    function start() {
        if (!percentage.value || percentage.value === 100) {
            fake.start();
            setTimerInterval();
        }
    }

    function end() {
        fake.end();
        progress.value = fake.progress;
    }

    function setTimerInterval() {
        clearTimerInterval();
        timerInterval = setInterval(() => {
            progress.value = fake.progress;
        }, 100);
    }

    function clearTimerInterval() {
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = null;
    }

    return {
        progress,
        percentage,
        start,
        end,
    };
}

