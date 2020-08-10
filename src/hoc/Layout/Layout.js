import React, { Component } from 'react';
import classes from './Layout.module.css'
import Aux from '../Auxi/Aux';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar'
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer'

class Layout extends Component{

    state={
        sideDrawer:false
    }

    sideDrawerClosedHandler=()=>{
        this.setState({sideDrawer:false})
    }
    sideDrawerOpenHandler=()=>{
        this.setState((prevState)=>{
            return {sideDrawer: !prevState.sideDrawer}
        })
    }
    render(){
        return(
            <Aux>
                <Toolbar clicked={this.sideDrawerOpenHandler}/>
                <SideDrawer
                    open={this.state.sideDrawer}
                    closed={this.sideDrawerClosedHandler}    
                />
                <main className={classes.Content}>
                    {this.props.children}
                </main>
             </Aux>
        )
    }
}

export default Layout;