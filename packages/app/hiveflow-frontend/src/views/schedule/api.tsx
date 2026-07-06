import { gql, useMutation, useQuery } from "@apollo/client"
import { useRef } from "react"

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

export const CALENDAR_ITEMS_QUERY = gql`
    query CalendarItems($startDate: DateTime, $endDate: DateTime){

    allUsers: users{
        id
        name
    }
     users(active: true){
            id
            name

            leave (where: {start_LTE: $endDate, end_GTE: $startDate}){
                id

                start
                end
            }
        }
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
            id
          name
        }
      }
    }  
  `;

export const useAPIData = (horizon: any) => {

    const { data: calendarData, loading } = useQuery(CALENDAR_ITEMS_QUERY, {
        variables: {
            startDate: horizon?.start,
            endDate: horizon?.end
        }
    })

    // Preserve the last known data during refetches to prevent
    // calendar items from vanishing when the horizon changes and
    // Apollo returns undefined for the new variables' cache key.
    const prevRef = useRef(calendarData);
    if (calendarData) prevRef.current = calendarData;

    return {
        calendarData: calendarData ?? prevRef.current,
        loading,
    }
}