export const checkOnlineStatus = async () => {
    try {
        const online = await fetch('')
        return online.status >= 200 && online.status < 300;
    } catch (error) {
        alert("You appear to be offline...")
        console.log(error)
        return false;
    }
}