import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import Button from '@material-ui/core/Button';

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
});

class TableActions extends Component {

	static propTypes = {
    	classes: PropTypes.object.isRequired,
    	count: PropTypes.number.isRequired,
    	onChangePage: PropTypes.func.isRequired,
    	page: PropTypes.number.isRequired,
    	rowsPerPage: PropTypes.number.isRequired,
    	theme: PropTypes.object.isRequired,
  	};

  	handleFirstPageButtonClick = event => {
    	this.props.onChangePage(event, 0);
  	};

  	handleBackButtonClick = event => {
    	this.props.onChangePage(event, this.props.page - 1);
  	};

  	handleNextButtonClick = event => {
    	this.props.onChangePage(event, this.props.page + 1);
  	};

  	handleLastPageButtonClick = event => {
    	this.props.onChangePage(event, Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1)
    );
  };

  	render() {
    	const { classes, count, page, rowsPerPage, theme } = this.props;

    	return (
      		<div className={classes.root}>
        		<IconButton onClick={this.handleFirstPageButtonClick} disabled={page === 0} aria-label="First Page">
         			{theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        		</IconButton>

        		<IconButton onClick={this.handleBackButtonClick} disabled={page === 0} aria-label="Previous Page">
          			{theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        		</IconButton>

        		<IconButton onClick={this.handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="Next Page">
          			{theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        		</IconButton>

        		<IconButton onClick={this.handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="Last Page">
          			{theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        		</IconButton>
      		</div>
    	);
  	}
}

const TableActionsWrapped = withStyles(actionsStyles, { withTheme: true })(TableActions);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 500,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  button: {
    margin: theme.spacing.unit,
  }
});

const CustomTableCell = withStyles(theme => ({
	head: {
	  backgroundColor: "#FF5722",
	  color: theme.palette.common.white,
	},
	body: {
	  fontSize: 14,
	},
  }))(TableCell);

class CustomTable extends Component {
	
	static propTypes = {
		classes: PropTypes.object.isRequired
	  };
	  
  	state = {
    	page: 0,
    	rowsPerPage: 10
  	};

  	handleChangePage = (event, page) => {
    	this.setState({ page });
  	};

  	handleChangeRowsPerPage = event => {
    	this.setState({ page: 0, rowsPerPage: event.target.value });
  	};

  	render() {
		const { rowsPerPage, page } = this.state;
    	const { classes, items, columns } = this.props;
		const emptyRows = rowsPerPage - Math.min(rowsPerPage, items.length - page * rowsPerPage);
		
		console.log(items);

    	return (
      		<Paper className={classes.root}>
        		<div className={classes.tableWrapper}>
          			<Table className={classes.table}>
					<TableHead>
						<TableRow>
							{columns.map((column, i) => (
								<CustomTableCell key={i}>{column}</CustomTableCell>
							))}
						</TableRow>
					</TableHead>
            		<TableBody>
              			{items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(item => (
                			<TableRow key={item.id}>
                  				{item.id && <TableCell component="th" scope="row">{item.id}</TableCell>}
								{item.fullname && <TableCell align="left">{item.fullname}</TableCell>}
								{item.birthDate && <TableCell align="left">{item.birthDate}</TableCell>}
								{item.gender && <TableCell align="left">{item.gender}</TableCell>}
								{item.fullname && <TableCell><Button color="primary" size="small" className={classes.button} onClick={() => this.props.handleClick(item.id)}>More information</Button></TableCell>}
								{item.name && <TableCell align="left">{item.name}</TableCell>}
								{item.isAntibiotic && <TableCell align="left">{item.isAntibiotic}</TableCell>}
                			</TableRow>
						))}
						  
              			{emptyRows > 0 && (
                			<TableRow style={{ height: 48 * emptyRows }}>
                  				<TableCell colSpan={6} />
                			</TableRow>
              			)}
            		</TableBody>
            		<TableFooter>
              			<TableRow>
                			<TablePagination
                  				rowsPerPageOptions={[10]}
                  				count={items.length}
                  				rowsPerPage={rowsPerPage}
                  				page={page}
                  				SelectProps={{native: true}}
                  				onChangePage={this.handleChangePage}
                  				onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  				ActionsComponent={TableActionsWrapped}
                			/>
              			</TableRow>
            		</TableFooter>
          			</Table>
        		</div>
      		</Paper>
    	);
  	}
}

export default withStyles(styles)(CustomTable);