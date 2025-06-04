export async function asyncSleep(duration: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}