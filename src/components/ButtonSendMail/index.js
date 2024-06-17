import cn from 'classnames';
import Icon from '../Icon';

export default function ButtonSendMail({
  className,
  handleClick = () => {},
  titleButton = 'Import',
}) {
  return (
    <button
      className={cn('button-small button-white-grey-border', className)}
      onClick={handleClick}
    >
      <Icon name="mail" size="24" />
      {titleButton}
    </button>
  );
}
