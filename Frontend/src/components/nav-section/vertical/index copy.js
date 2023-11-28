import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { List, Box, ListSubheader } from '@mui/material';
//
import { NavListRoot } from './NavList';
import useAuth from '../../../hooks/useAuth';

// ----------------------------------------------------------------------
export const ListSubheaderStyle = styled(({ subheader, ...rest }) => (
  <ListSubheader {...rest} disableSticky disableGutters>
    {subheader}
  </ListSubheader>
))(({ theme }) => ({
  ...theme.typography.overline,
  paddingTop: theme.spacing(3),
  paddingLeft: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  fontFamily: 'Public Sans,sans-serif',
  color: '#a3aed1 !important',
  fontWeight: '700',
  lineHeight: '1.5',
  fontSize: ' 0.75rem',
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
}));

// ----------------------------------------------------------------------

NavSectionVertical.propTypes = {
  isCollapse: PropTypes.bool,
  navConfig: PropTypes.array,
};

export default function NavSectionVertical({ isNavUser, navConfig, isCollapse = false, ...other }) {
  const { user } = useAuth();
  console.log('user123123', user);

  return (
    <Box {...other} sx={isNavUser === 'yes' && { marginTop: 2 }}>
      {navConfig.map(
        (group) => (
          console.log('group.subheader', group.subheader),
          (
            <List key={group.subheader} disablePadding sx={isNavUser !== 'yes' && { px: 2 }}>
              {isNavUser !== 'yes' && <ListSubheaderStyle subheader={group.subheader} />}

              {group.items.map((list) => (
                <NavListRoot key={list.title} list={list} isCollapse={isCollapse} />
              ))}
            </List>
          )
        )
      )}
    </Box>
  );
}
