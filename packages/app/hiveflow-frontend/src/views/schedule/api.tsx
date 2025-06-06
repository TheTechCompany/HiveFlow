import { gql, useMutation, useQuery } from "@apollo/client"

export const useAPIFunctions = () => {

    const [createCalendarItem] = useMutation(gql`
        mutation CreateCalendarItem ($input: CalendarItemInput) {
          createCalendarItem(input: $input){
            id
          }
        }  
      `, {
        refetchQueries: ['CalendarItems']
    })

    const [updateCalendarItem] = useMutation(gql`
        mutation UpdateCalendarItem ($id: ID, $input: CalendarItemInput) {
          updateCalendarItem(id: $id, input: $input){
            id
          }
        }  
      `, {
        refetchQueries: ['CalendarItems']
    })

    const [deleteCalendarItem] = useMutation(gql`
        mutation UpdateCalendarItem ($id: ID) {
          deleteCalendarItem(id: $id){
            id
          }
        }  
      `, {
        refetchQueries: ['CalendarItems']
    })

    const [joinCalendarItem] = useMutation(gql`
        mutation Join ($id: ID){
            joinCalendarItem(id: $id){
                id
            }
        }    
    `, {
        refetchQueries: ['CommentQuery', 'CalendarItems']
    })

    const [leaveCalendarItem] = useMutation(gql`
        mutation Leave ($id: ID){
            leaveCalendarItem(id: $id){
                id
            }
        }    
    `, {
        refetchQueries: ['CommentQuery', 'CalendarItems']
    })


    const [commentOnCalendar] = useMutation(gql`
        
        mutation($id: ID, $message: String){
            commentOnCalendar(id: $id, message: $message){
                id
            }
        }    
    `, {
        refetchQueries: ['CommentQuery']
    })

    const [removeCommentOnCalendar] = useMutation(gql`
        
        mutation($id: ID, $message: ID){
            removeCommentOnCalendar(id: $id, comment: $message){
                id
            }
        }    
    `, {
        refetchQueries: ['CommentQuery']
    })






    return {
        deleteCalendarItem,
        updateCalendarItem,
        createCalendarItem,
        joinCalendarItem,
        leaveCalendarItem,
        commentOnCalendar,
        removeCommentOnCalendar
    }
}

export const useAPIData = (horizon: any) => {

    const { data: calendarData } = useQuery(gql`
        query CalendarItems($startDate: DateTime, $endDate: DateTime){
          calendarItems (where: {start_LTE: $endDate, end_GTE: $startDate} ){
            id
            start
            end
    
            data
            groupBy
    
            permissions {
    
              user {
                id
                name
              }
            }
    
            createdBy {
              name
            }
          }
        }  
      `, {
        variables: {
            startDate: horizon?.start,
            endDate: horizon?.end
        }
    })


    return {
        calendarData
    }
}