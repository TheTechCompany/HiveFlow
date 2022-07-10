import { FileExplorer, FileDialog } from "@hexhive/ui";
import { createTheme, Divider, Menu, MenuItem, ThemeProvider } from "@mui/material";
import { FolderModal } from "../../../../modals/folder-modal";
import { Box } from "grommet";
import React, { useRef, useState } from "react";
import { mutate, useMutation } from "@hive-flow/api";
import { useMutation as useApolloMutation, useQuery, gql, useApolloClient } from "@apollo/client";
import { useProjectInfo } from "../context";
import { FilePreviewDialog } from "../../../../modals/file-preview";
import {nanoid} from 'nanoid'
import { ExplorerModal } from "../../../../modals/file-explorer";

const theme = createTheme({
  palette: {
    primary: {
      main: '#72738b'
    },
    secondary: {
      // light: '#a3b579',
      main: "#87927e"
    }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          overflow: "hidden"
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          background: 'green'
        }
      }
    }
  }
  // palette: {
  //   // primary: {
  //   //   main: '',
  //   // },
  //   // secondary: {
  //   //   main: ''
  //   // }
  // }
});
export const FilePane = () => {

    const { projectId } = useProjectInfo();

    const client = useApolloClient()

    const [ moveOpen, openMove ] = useState<any>();

    const [activePath, setActivePath] = useState('/');

    const [createFolderOpen, openCreateFolder] = useState<boolean>(false)
    const [filePreviewOpen, openFilePreview] = useState<any>(null)

    const [anchorPos, setAnchorPos] = useState<{ top: number, left: number }>()

    const uploading = useRef<{loading?: {id?: string, name?: string, percent?: number}[]}>({loading: []})

    const [createDirectory] = useMutation((mutation, args: any) => {
        const item = mutation.createProjectFolder({ project: projectId, path: `${activePath}/${args.path}` })
        return {
            item: {
                ...item
            }
        }
    })

    const [ moveFile ] = useMutation((mutation, args: any) => {
      const item = mutation.moveProjectFile({project: projectId, path: `${activePath}/${args.path}`, newPath: args.newPath})
      return {
        item: {
          ...item
        }
      }
    })

    const [ deleteFile ] = useMutation((mutation, args: any) => {
      const item = mutation.deleteProjectFile({ project: projectId, path: `${activePath}/${args.path}` })
      return {
        item: {
          ...item
        }
      }
    })

    const [ renameFile ] = useMutation((mutation, args: { path: string, newPath: string }) => {
      const item = mutation.renameProjectFile({project: projectId, path: `${activePath}/${args.path}`, newPath: args.newPath})
      return {
        item: {
          ...item
        }
      }
    })

    const [uploadFiles] = useApolloMutation(gql`
        mutation UploadFile($project: ID!, $path: String, $files: [Upload]){
            uploadProjectFiles(project: $project, path: $path, files: $files){
                id
                name
            }
        }
    `, {
      context: {
        fetchOptions: {
          onUploadProgress: (event) => {
            console.log("Upload progress", {event})
            const progress = (event.loaded / event.total) * 100

            uploading.current.loading.forEach((item, ix) => {
              (uploading.current.loading || [])[ix].percent = progress;
            })

          }
        }
      }
    })

    const { data, loading } = useQuery(gql`
        query GetProjectFiles($id: String, $path: String) {
            projects(where: {displayId: $id}){
            
                files(path: $path) {
                    id
                    name
                    directory
                    size
                }
            
            }
        }
    `, {
        variables: {
            id: projectId,
            path: activePath
        }
    })

    const refetch = () => {
        client.refetchQueries({include: ['GetProjectFiles']})
    };
    

    const files = data?.projects?.[0]?.files || [];

    return (

        <Box flex>
          <ExplorerModal
              open={Boolean(moveOpen)}
              onClose={() => {
                openMove(null)
              }}
              onSubmit={(path) => {
                moveFile({
                  args: {
                    path: moveOpen.name,
                    newPath: path
                  }
                }).then(() => {
                  openMove(null);
                })
              }}
              projectId={projectId}
              />
            <FilePreviewDialog
                open={Boolean(filePreviewOpen)}
                onClose={() => openFilePreview(null)}
                files={filePreviewOpen ? [filePreviewOpen.id] : []}
                />
            
           
            <FileExplorer
              path={activePath}
              loading={loading}
              previewEngines={[
                {
                  filetype: '.png',
                  component: ({ file }) => <Box>file</Box>
                }
              ]}
              actions={[
                {key: 'move', label: 'Move', onClick: (file) => {
                  console.log({file})
                  openMove(file)
                }}
              ]}
              onCreateFolder={async (folder) => {
                await createDirectory({
                  args: {
                    path: folder
                  }
                })
                  refetch()
                
              }}
              onDelete={async (file) => {
                await deleteFile({args: {path: file.name}})
                
                await refetch()
              }}
              onRename={async (file, newName) => {
                await renameFile({
                  args: {
                    path: file.name,
                    newPath: newName
                  }
                })
                
                await refetch()
              }}
              uploading={uploading.current.loading || []}
              onClick={(file) => {
                openFilePreview(file)
              }}
              onNavigate={(path) => {
                setActivePath(path)
              }}
              files={files?.map((x: any) => ({ ...x, isFolder: x.directory })) || []}
              onDrop={(files) => {

                uploading.current.loading = (files || []).map((x) => ({id: nanoid(), name: x.name, percent: 0}));

                uploadFiles({
                  variables: {
                    project: projectId,
                    path: activePath,
                    files
                  }
                }).then(() => {
                  refetch()
                })
              }}
            />
          </Box>
    )
}