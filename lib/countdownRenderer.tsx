export const countdownRenderer = ({days, hours, minutes, seconds, completed}) => {
    return <span>{completed ? '-' : ''}{days}d {hours}h {minutes}m {seconds}s</span>;
};